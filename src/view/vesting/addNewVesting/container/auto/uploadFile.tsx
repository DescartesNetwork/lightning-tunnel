import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Papa from 'papaparse'
import fileDownload from 'js-file-download'

import { Space, Typography, Upload, Image, Spin, Row, Col, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FileDetails from './fileDetails'

import iconUpload from 'static/images/icon-upload.svg'
import { AppState } from 'model'
import exampleCSV from 'static/base/example-vesting.csv'
import {
  addRecipients,
  removeRecipients,
  RecipientInfos,
} from 'model/recipients.controller'
import { setFileName } from 'model/file.controller'
import ModalError from './action/modalError'
import { getFileCSV } from 'helper'

const MIN_FILE_LENGTH = 2

const parse = (file: any): Promise<Array<[string, string, string]>> => {
  return new Promise((resolve, reject) => {
    return Papa.parse(file, {
      skipEmptyLines: true,
      complete: ({ data }) => {
        resolve(data as Array<[string, string, string]>)
      },
    })
  })
}

const UploadFile = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [isWrongFormat, setIsWrongFormat] = useState(false)
  const [visible, setVisible] = useState(false)

  const {
    recipients: { recipientInfos },
  } = useSelector((state: AppState) => state)

  const upload = useCallback(
    async (file: any) => {
      setLoading(true)
      const recipients = await parse(file)
      const recipientInfos: RecipientInfos = {}

      for (const recipientData of recipients) {
        //Check format file
        if (recipientData.length <= MIN_FILE_LENGTH) {
          setLoading(false)
          return setVisible(true)
        }
        const [address, amount, time] = recipientData
        const unlockTime = new Date(time).getTime()
        const recipientInfo = {
          address,
          amount,
          unlockTime,
        }

        if (recipientInfos[address]) {
          let data = [...recipientInfos[address]]
          data.push(recipientInfo)
          recipientInfos[address] = data
          continue
        }
        recipientInfos[address] = [recipientInfo]
      }

      dispatch(setFileName(file.name))
      dispatch(addRecipients({ recipientInfos }))
      setLoading(false)
      return false
    },
    [dispatch],
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

    return <Typography.Text>Wrong format file</Typography.Text>
  }, [isWrongFormat])

  const closeModalError = () => {
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
        <ModalError
          visible={visible}
          onClose={closeModalError}
          description={describeError}
        />
      </Row>
    )
  return <FileDetails remove={remove} />
}

export default UploadFile
