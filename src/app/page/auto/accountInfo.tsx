import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Button,
  Col,
  Row,
  Space,
  Typography,
  Tooltip,
  Checkbox,
  Input,
} from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { shortenAddress } from 'shared/util'
import { AppDispatch, AppState } from 'app/model'
import { setErrorDatas } from 'app/model/recipients.controller'
import { account } from '@senswap/sen-js'

type AccountInfoProps = {
  accountAddress?: string
  selected?: boolean
  email?: string
  amount?: number | string
  index: number
  onChecked?: (checked: boolean, index: number) => void
}

type EditButtonProps = {
  wrongAddress?: boolean
  isEdited?: boolean
  onEdited?: (isEdited: boolean) => void
  onUpdate?: () => void
  onDelete?: () => void
}

type AlertIconProps = { editable?: boolean; wrongAddress?: boolean }

const AlertIcon = ({
  editable = false,
  wrongAddress = false,
}: AlertIconProps) => {
  if (wrongAddress)
    return (
      <Tooltip
        title="Wrong wallet address!"
        placement="topLeft"
        arrowPointAtCenter
      >
        <IonIcon name="close-circle-outline" style={{ color: '#d72311' }} />
      </Tooltip>
    )
  if (editable)
    return <IonIcon name="alert-circle-outline" style={{ color: '#D72311' }} />
  return <IonIcon name="checkmark-outline" style={{ color: '#03A326' }} />
}

const EditButton = ({
  wrongAddress = false,
  isEdited = false,
  onEdited = () => {},
  onUpdate = () => {},
  onDelete = () => {},
}: EditButtonProps) => {
  if (wrongAddress)
    return (
      <Button
        type="text"
        icon={<IonIcon name="trash-outline" />}
        onClick={onDelete}
      />
    )
  if (!isEdited)
    return (
      <Button
        type="text"
        icon={<IonIcon name="create-outline" />}
        onClick={() => onEdited(true)}
      />
    )
  return (
    <Button
      type="text"
      icon={<IonIcon name="cloud-upload-outline" />}
      onClick={onUpdate}
    />
  )
}

const AccountInfo = ({
  accountAddress = '',
  email = '',
  amount = 0,
  selected = false,
  onChecked = () => {},
  index,
}: AccountInfoProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isEdited, setIsEdited] = useState(false)
  const [nextEmail, setNextEmail] = useState('')
  const [nextAmount, setNextAmount] = useState('')
  const {
    recipients: { errorDatas, recipients },
    main: { selectedFile },
  } = useSelector((state: AppState) => state)

  const editable = !amount || !email
  const wrongAddress = !account.isAddress(accountAddress)
  const emailValue = isEdited ? nextEmail : shortenAddress(email, 8)
  const amountValue = isEdited ? nextAmount : amount
  const idxErrData = index - recipients.length

  const onUpdate = useCallback(() => {
    if (!errorDatas?.length || index - errorDatas.length < 0) return
    const nextErrorData = [...errorDatas]
    const [[address]] = nextErrorData.splice(idxErrData, 1)
    nextErrorData.unshift([address, nextEmail, nextAmount])
    dispatch(setErrorDatas({ errorDatas: nextErrorData }))
  }, [dispatch, errorDatas, idxErrData, index, nextAmount, nextEmail])

  const onDelete = useCallback(async () => {
    if (!errorDatas?.length) return
    const nextErrData = [...errorDatas]
    nextErrData.splice(idxErrData, 1)
    dispatch(setErrorDatas({ errorDatas: nextErrData }))
  }, [dispatch, errorDatas, idxErrData])

  return (
    <Row gutter={[16, 8]}>
      <Col span={24}>
        <Row
          gutter={[16, 8]}
          align="middle"
          justify="space-between"
          wrap={false}
        >
          <Col style={{ minWidth: 60 }}>
            <Space>
              {selected && (
                <Checkbox
                  checked={selectedFile?.includes(index)}
                  onChange={(e) => onChecked(e.target.checked, index)}
                />
              )}
              <Typography.Text type="secondary">#{index + 1}</Typography.Text>
            </Space>
          </Col>
          <Col style={{ minWidth: 150 }}>
            <Tooltip title={accountAddress}>
              <Typography.Text>
                {shortenAddress(accountAddress)}
              </Typography.Text>
            </Tooltip>
          </Col>
          <Col style={{ minWidth: 150 }}>
            <Input
              value={emailValue}
              bordered={false}
              onChange={(e) => setNextEmail(e.target.value)}
              disabled={!isEdited}
            />
          </Col>
          <Col style={{ minWidth: 140, textAlign: 'right' }}>
            <Input
              value={amountValue}
              bordered={false}
              onChange={(e) => setNextAmount(e.target.value)}
              disabled={!isEdited}
            />
          </Col>
          {!!errorDatas?.length && (
            <Col style={{ minWidth: 70 }}>
              <Space align="center">
                <AlertIcon editable={editable} wrongAddress={wrongAddress} />
                <EditButton
                  isEdited={isEdited}
                  wrongAddress={wrongAddress}
                  onEdited={setIsEdited}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </Space>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  )
}

export default AccountInfo
