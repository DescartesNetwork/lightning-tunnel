import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Papa from 'papaparse'

import { Space, Typography, Upload, Image, Spin, Row, Col } from 'antd'

import {
  setData,
  setDecimalized,
  TransferData,
} from 'app/model/main.controller'

import iconUpload from 'app/static/images/icon-upload.svg'
import { AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import FileDetails from './fileDetails'

const parse = (file: any): Promise<TransferData> => {
  return new Promise((resolve, reject) => {
    return Papa.parse(file, {
      skipEmptyLines: true,
      complete: ({ data }) => resolve(data as TransferData),
    })
  })
}

const UploadFile = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { data } = useSelector((state: AppState) => state.main)

  const upload = async (file: any) => {
    setLoading(true)
    dispatch(setDecimalized(false))
    dispatch(setData(await parse(file)))
    setLoading(false)
    return false
  }
  const remove = async () => {
    setLoading(true)
    dispatch(setData([]))
    setLoading(false)
    return true
  }

  if (!data.length)
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
          <Space style={{ cursor: 'pointer' }}>
            <IonIcon name="download-outline" />
            <Typography.Text style={{ fontWeight: 700 }}>
              Download sample
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    )
  return <FileDetails />
}

export default UploadFile
