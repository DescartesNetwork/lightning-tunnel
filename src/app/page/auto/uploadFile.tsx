import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Papa from 'papaparse'
import fileDownload from 'js-file-download'

import { Space, Typography, Upload, Image, Spin, Row, Col, Button } from 'antd'

import { setDecimalized, setFileName } from 'app/model/main.controller'
import FileDetails from './fileDetails'

import iconUpload from 'app/static/images/icon-upload.svg'
import { AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import {
  addRecipients,
  RecipientsInfo,
  removeRecipients,
  TransferData,
} from 'app/model/recipients.controller'
import exampleCSV from 'app/static/base/example.csv'
import ModalConfirm from 'app/components/modalConfirm'

const parse = (file: any): Promise<TransferData> => {
  return new Promise((resolve, reject) => {
    return Papa.parse(file, {
      skipEmptyLines: true,
      complete: ({ data }) => resolve(data as TransferData),
    })
  })
}

const UploadFile = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [duplicateAddress, setDuplicateAddress] = useState<string[]>([])
  const [parsedCSVData, setParsedCSVData] = useState<RecipientsInfo>()
  const { recipients } = useSelector((state: AppState) => state.recipients)

  const getCSVData = useCallback((data: TransferData) => {
    if (!data || !data.length) return { duplicateFile: [], parsedData: {} }
    let duplicateFile: string[] = []
    let parsedData: RecipientsInfo = {}
    data.forEach(([email, address, amount], idx) => {
      if (!!parsedData[address]) {
        if (!duplicateFile.includes(address)) duplicateFile.push(address)
        const newAmount = Number(amount)
        const { amount: oldAmount } = parsedData[address]
        return (parsedData[address] = {
          ...parsedData[address],
          amount: oldAmount + newAmount,
        })
      }
      return (parsedData[address] = {
        walletAddress: address,
        amount: Number(amount),
        email,
      })
    })
    return { duplicateFile, parsedData }
  }, [])

  const onSetRecipients = useCallback(
    (data?: RecipientsInfo) => {
      const recipients = data || parsedCSVData || {}
      return dispatch(addRecipients({ recipients }))
    },
    [dispatch, parsedCSVData],
  )

  const upload = useCallback(
    async (file: any) => {
      setLoading(true)
      dispatch(setDecimalized(false))
      const parseFile = await parse(file)
      const { duplicateFile, parsedData } = await getCSVData(parseFile)
      await setParsedCSVData(parsedData)
      dispatch(setFileName(file.name))
      if (!!duplicateFile?.length) return setDuplicateAddress(duplicateFile)
      onSetRecipients(parsedData)
      setLoading(false)
      return false
    },
    [getCSVData, dispatch, onSetRecipients],
  )

  const remove = async () => {
    setLoading(true)
    dispatch(removeRecipients())
    setParsedCSVData(undefined)
    setDuplicateAddress([])
    setLoading(false)
    setVisible(false)
    return true
  }

  const getFileCSV = async (fileCSV: string) => {
    return fetch(fileCSV).then(function (response) {
      let reader = response.body?.getReader()
      let decoder = new TextDecoder('utf-8')
      return reader?.read().then(function (result) {
        return decoder.decode(result.value)
      })
    })
  }

  const onDownload = async () => {
    if (!exampleCSV) return
    const file = (await getFileCSV(exampleCSV)) || ''
    fileDownload(file, 'example.csv')
  }

  useEffect(() => {
    if (!!duplicateAddress.length) return setVisible(true)
  }, [duplicateAddress])

  if (!Object.keys(recipients).length)
    return (
      <Row gutter={[8, 8]} justify="end">
        <Col span={24}>
          <Spin spinning={loading}>
            <Upload.Dragger
              accept=".csv,.txt"
              beforeUpload={upload}
              onRemove={remove}
              maxCount={1}
              className="upload-file"
              showUploadList
              progress={{ strokeWidth: 2, showInfo: true }}
              fileList={[]}
            >
              <Space direction="vertical" size={24} align="center">
                <Image src={iconUpload} preview={false} />
                <Space direction="vertical" size={4} align="center">
                  <Typography.Text>
                    Click or Drop file to upload
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    The accepted file types are <code>.csv</code>,{' '}
                    <code>.txt</code>.
                  </Typography.Text>
                </Space>
              </Space>
            </Upload.Dragger>
          </Spin>
        </Col>
        <Col>
          <Button
            type="text"
            style={{ padding: 0, background: 'transparent', fontWeight: 700 }}
            icon={<IonIcon name="download-outline" />}
            onClick={onDownload}
          >
            Download sample
          </Button>
        </Col>
        <ModalConfirm
          visible={visible}
          title="Do you want to merge the wallet addresses? "
          description={
            <Space direction="vertical">
              <Typography.Text>
                There are {duplicateAddress.length} identical wallet addresses:
              </Typography.Text>
              {duplicateAddress.map((addr, idx) => (
                <Typography.Text key={addr + idx}>{addr}</Typography.Text>
              ))}
            </Space>
          }
          textButtonConfirm="Confirm merge"
          closeModal={remove}
          onConfirm={() => onSetRecipients()}
        />
      </Row>
    )
  return <FileDetails onRemove={remove} />
}

export default UploadFile
