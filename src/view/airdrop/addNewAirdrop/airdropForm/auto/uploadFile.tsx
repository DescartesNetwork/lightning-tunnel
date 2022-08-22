import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Papa from 'papaparse'
import fileDownload from 'js-file-download'
import { utilsBN } from '@sen-use/web3'
import { useMintDecimals } from '@sentre/senhub'

import { Space, Typography, Upload, Image, Spin, Row, Col, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FileDetails from './fileDetails'
import ModalMerge from 'components/commonModal'

import { AppState } from 'model'
import { getFileCSV } from 'helper'
import {
  addRecipients,
  removeRecipients,
  RecipientInfos,
} from 'model/recipients.controller'
import { setFileName } from 'model/file.controller'

import iconUpload from 'static/images/icon-upload.svg'
import exampleCSV from 'static/base/example.csv'

const parse = (file: any): Promise<Array<[string, string]>> => {
  return new Promise((resolve, reject) => {
    return Papa.parse(file, {
      skipEmptyLines: true,
      complete: ({ data }) => {
        resolve(data as Array<[string, string]>)
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
  const mintDecimals = useMintDecimals({ mintAddress: mintSelected }) || 0

  const upload = useCallback(
    async (file: any) => {
      setLoading(true)
      const recipients = await parse(file)
      if (!mintDecimals) return

      const recipientInfos: RecipientInfos = {}
      let isDuplicate = false

      for (const [address, amount] of recipients) {
        if (recipientInfos[address]) {
          isDuplicate = true
          const listRecipient = [...recipientInfos[address]]
          const oldAmount = utilsBN.decimalize(
            listRecipient[0].amount,
            mintDecimals,
          )
          const newAmount = oldAmount.add(
            utilsBN.decimalize(amount, mintDecimals),
          )
          recipientInfos[address] = [
            {
              address,
              amount: utilsBN.undecimalize(newAmount, mintDecimals),
              unlockTime: globalUnlockTime,
            },
          ]
          continue
        }
        recipientInfos[address] = [
          { address, amount, unlockTime: globalUnlockTime },
        ]
      }

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
