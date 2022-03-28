import { useCallback, useRef, useState } from 'react'
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
import NumericInput from 'shared/antd/numericInput'

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
    return (
      <Tooltip
        title="Invalid email or amount!"
        placement="topLeft"
        arrowPointAtCenter
      >
        <IonIcon name="warning-outline" style={{ color: '#d72311' }} />
      </Tooltip>
    )
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
  amount = 0,
  selected = false,
  onChecked = () => {},
  index,
}: AccountInfoProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isEdited, setIsEdited] = useState(false)
  const [nextAmount, setNextAmount] = useState('')
  const {
    recipients: { errorDatas, recipients },
    main: { selectedFile },
  } = useSelector((state: AppState) => state)
  const amountRef = useRef<Input>(null!)

  const editable = !amount
  const wrongAddress = !account.isAddress(accountAddress)
  const amountValue = isEdited ? nextAmount : amount
  const idxErrData = index - recipients.length

  const onUpdate = useCallback(() => {
    if (!errorDatas?.length || index - errorDatas.length < 0) return
    const nextErrorData = [...errorDatas]
    const [[address]] = nextErrorData.splice(idxErrData, 1)
    nextErrorData.unshift([address, nextAmount])
    dispatch(setErrorDatas({ errorDatas: nextErrorData }))
  }, [dispatch, errorDatas, idxErrData, index, nextAmount])

  const onDelete = useCallback(async () => {
    if (!errorDatas?.length) return
    const nextErrData = [...errorDatas]
    nextErrData.splice(idxErrData, 1)
    dispatch(setErrorDatas({ errorDatas: nextErrData }))
  }, [dispatch, errorDatas, idxErrData])

  const onEdit = (visible: boolean) => {
    setIsEdited(visible)
    if (amountRef.current) amountRef.current.focus()
  }

  return (
    <Row gutter={[16, 8]} align="middle" justify="space-between" wrap={false}>
      <Col style={{ minWidth: 60 }}>
        <Space>
          {selected && (
            <Checkbox
              checked={selectedFile?.includes(index)}
              onChange={(e) => onChecked(e.target.checked, index)}
              className="lightning-checkbox"
            />
          )}
          <Typography.Text type="secondary">#{index + 1}</Typography.Text>
        </Space>
      </Col>
      <Col style={{ minWidth: 296 }}>
        <Tooltip title={accountAddress}>
          <Typography.Text>{shortenAddress(accountAddress)}</Typography.Text>
        </Tooltip>
      </Col>
      <Col style={{ minWidth: 100 }}>
        <NumericInput
          value={amountValue}
          bordered={isEdited}
          onChange={(e) => setNextAmount(e.target.value)}
          disabled={!isEdited}
          style={{ padding: 0 }}
          className="recipient-input"
          ref={amountRef}
        />
      </Col>
      {!!errorDatas?.length && (
        <Col style={{ minWidth: 70 }}>
          {editable && (
            <Space align="center">
              <AlertIcon editable={editable} wrongAddress={wrongAddress} />
              <EditButton
                isEdited={isEdited}
                wrongAddress={wrongAddress}
                onEdited={onEdit}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </Space>
          )}
        </Col>
      )}
    </Row>
  )
}

export default AccountInfo
