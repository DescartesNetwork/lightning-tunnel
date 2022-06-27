import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Papa from 'papaparse'
import fileDownload from 'js-file-download'
import { utils } from '@senswap/sen-js'

import { Space, Typography, Upload, Image, Spin, Row, Col, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FileDetails from './fileDetails'

import iconUpload from 'app/static/images/icon-upload.svg'
import { AppState } from 'app/model'
import exampleCSV from 'app/static/base/example-vesting.csv'
import {
  addRecipients,
  removeRecipients,
  RecipientInfos,
  RecipientInfo,
} from 'app/model/recipients.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { setFileName } from 'app/model/file.controller'
import ModalErrorDuplicate from './action/modalError'
import { getFileCSV } from 'app/helper'

const INDEX_ADDRESS = 0
const INDEX_AMOUNT = 1
const INDEX_FIRST_UNLOCK_TIME = 2
const MIN_FILE_LENGTH = 2

const parse = (file: any): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    return Papa.parse(file, {
      skipEmptyLines: true,
      complete: ({ data }) => {
        resolve(data as Array<string>)
      },
    })
  })
}

const UploadFile = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [listDuplicate, setListDuplicate] = useState<string[]>([])
  const [isWrongFormat, setIsWrongFormat] = useState(false)
  const [visible, setVisible] = useState(false)

  const {
    recipients: { recipientInfos },
    main: { mintSelected },
  } = useSelector((state: AppState) => state)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const upload = useCallback(
    async (file: any) => {
      setLoading(true)
      const recipients = await parse(file)
      const recipientInfos: RecipientInfos = {}
      const duplicates: string[] = []
      let isDuplicate = false

      for (const recipientData of recipients) {
        //Check format file
        if (recipientData.length <= MIN_FILE_LENGTH) {
          setLoading(false)
          return setVisible(true)
        }

        const address = recipientData[INDEX_ADDRESS]
        const amount = utils.decimalize(
          recipientData[INDEX_AMOUNT],
          mintDecimals,
        )

        //Check duplicate Data
        if (recipientInfos[address]) {
          duplicates.push(address)
          isDuplicate = true
          continue
        }

        const recipientInfo: RecipientInfo[] = []
        const amountVesting = recipientData.length - INDEX_FIRST_UNLOCK_TIME
        const newAmount = amount / BigInt(amountVesting)
        for (let i = INDEX_FIRST_UNLOCK_TIME; i < recipientData.length; i++) {
          const unlockTime = new Date(recipientData[i]).getTime()

          //Check format date
          if (!unlockTime) {
            setIsWrongFormat(true)
            setLoading(false)
            return setVisible(true)
          }

          recipientInfo.push({
            address,
            amount: utils.undecimalize(newAmount, mintDecimals),
            unlockTime,
          })
        }
        recipientInfos[address] = recipientInfo
      }

      if (isDuplicate) {
        setListDuplicate(duplicates)
        setLoading(false)
        return setVisible(true)
      }

      dispatch(setFileName(file.name))
      dispatch(addRecipients({ recipientInfos }))
      setLoading(false)
      return false
    },
    [dispatch, mintDecimals],
  )

  const remove = async () => {
    dispatch(removeRecipients())
    return true
  }

  const onDownload = async () => {
    if (!exampleCSV) return
    const file = (await getFileCSV(exampleCSV)) || ''
    fileDownload(file, 'example.csv')
  }

  const describeError = useMemo(() => {
    if (isWrongFormat)
      return (
        <Typography.Text>
          Wrong date format. It’s should be{' '}
          <span style={{ color: '#42E6EB' }}>MM-DD-YYYY HH:mm.</span>
        </Typography.Text>
      )
    if (listDuplicate.length)
      return (
        <Typography.Text>
          There are some wrong wallet addresses:
        </Typography.Text>
      )
    return <Typography.Text>Wrong format file</Typography.Text>
  }, [isWrongFormat, listDuplicate])

  const closeModalError = () => {
    setListDuplicate([])
    setIsWrongFormat(false)
    return setVisible(false)
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
        <ModalErrorDuplicate
          visible={visible}
          onClose={closeModalError}
          addresses={listDuplicate}
          description={describeError}
        />
      </Row>
    )
  return <FileDetails remove={remove} />
}

export default UploadFile
