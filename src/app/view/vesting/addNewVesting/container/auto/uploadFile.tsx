import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Papa from 'papaparse'
import fileDownload from 'js-file-download'
import { utils } from '@senswap/sen-js'

import { Space, Typography, Upload, Image, Spin, Row, Col, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FileDetails from './fileDetails'
import ModalMerge from 'app/components/commonModal'

import iconUpload from 'app/static/images/icon-upload.svg'
import { AppState } from 'app/model'
import exampleCSV from 'app/static/base/example.csv'
import {
  addRecipients,
  removeRecipients,
  RecipientInfos,
  RecipientInfo,
} from 'app/model/recipients.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { setFileName } from 'app/model/file.controller'
import { notifyError } from 'app/helper'

const INDEX_ADDRESS = 0
const INDEX_AMOUNT = 1
const INDEX_FIRST_UNLOCK_TIME = 2

const parse = (file: any): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    return Papa.parse(file, {
      skipEmptyLines: true,
      complete: ({ data }) => {
        console.log(data, ' data')
        resolve(data as Array<string>)
      },
    })
  })
}

const UploadFile = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [listDuplicate, setListDuplicate] = useState<RecipientInfos>({})
  const {
    recipients: { recipientInfos, globalUnlockTime },
    main: { mintSelected },
  } = useSelector((state: AppState) => state)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const upload = useCallback(
    async (file: any) => {
      setLoading(true)
      const recipients = await parse(file)

      const recipientInfos: RecipientInfos = {}
      let isDuplicate = false

      for (const recipientData of recipients) {
        const address = recipientData[INDEX_ADDRESS]
        const amount = utils.decimalize(
          recipientData[INDEX_AMOUNT],
          mintDecimals,
        )

        if (recipientInfos[address]) {
          isDuplicate = true
          const listRecipient = [...recipientInfos[address]]
          const oldAmount = utils.decimalize(
            listRecipient[0].amount,
            mintDecimals,
          )
          const newAmount = oldAmount + amount

          recipientInfos[address] = [
            {
              address,
              amount: utils.undecimalize(newAmount, mintDecimals),
              unlockTime: globalUnlockTime,
            },
          ]
          continue
        }
        const recipientInfo: RecipientInfo[] = []
        const amountVesting = recipientData.length - INDEX_FIRST_UNLOCK_TIME
        const newAmount = amount / BigInt(amountVesting)
        for (let i = INDEX_FIRST_UNLOCK_TIME; i < recipientData.length; i++) {
          recipientInfo.push({
            address,
            amount: utils.undecimalize(newAmount, mintDecimals),
            unlockTime: new Date(recipientData[i]).getTime(),
          })
        }
        recipientInfos[address] = recipientInfo
      }
      console.log('recipientInfos: ', recipientInfos)
      if (isDuplicate) {
        setListDuplicate(recipientInfos)
        setLoading(false)
        setVisible(true)
        dispatch(setFileName(file.name))
        return true
      }

      dispatch(setFileName(file.name))
      dispatch(addRecipients({ recipientInfos }))
      setLoading(false)
      setVisible(false)
      return false
    },
    [dispatch, globalUnlockTime, mintDecimals],
  )

  const remove = async () => {
    dispatch(removeRecipients())
    setListDuplicate({})
    return true
  }

  const onMerge = () => {
    dispatch(addRecipients({ recipientInfos: listDuplicate }))
    return setVisible(false)
  }

  const onCancel = () => {
    setVisible(false)
    dispatch(setFileName(''))
    setListDuplicate({})
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

  if (!Object.values(recipientInfos).length)
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
        <ModalMerge
          title="Do you want to merge wallet addresses?"
          description="There are some wallet addresses that are the same."
          visible={visible}
          setVisible={setVisible}
          onConfirm={onMerge}
          onCancel={onCancel}
          btnText="merge"
        />
      </Row>
    )
  return <FileDetails remove={remove} />
}

export default UploadFile
