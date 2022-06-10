import { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import NumericInput from '@sentre/antd-numeric-input'

import { Button, Col, Row, Space, Typography, Tooltip, Checkbox } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { shortenAddress } from 'shared/util'
import { AppDispatch, AppState } from 'app/model'
import { setErrorData } from 'app/model/recipients.controller'

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
      <Tooltip title="Invalid  amount!" placement="topLeft" arrowPointAtCenter>
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

const AccountInfo = forwardRef(
  (
    {
      accountAddress = '',
      amount = 0,
      selected = false,
      onChecked = () => {},
      index,
    }: AccountInfoProps,
    ref: any,
  ) => {
    const dispatch = useDispatch<AppDispatch>()
    const [isEdited, setIsEdited] = useState(false)
    const [nextAmount, setNextAmount] = useState('')
    const {
      recipients: { errorData, recipients },
      file: { selectedFile },
      setting: { decimal },
    } = useSelector((state: AppState) => state)
    const amountRef = useRef(ref)

    const editable = !amount
    const isValidAddress = !account.isAddress(accountAddress)
    const amountValue = isEdited ? nextAmount : amount
    const idxErrData = index - recipients.length

    const onUpdate = useCallback(() => {
      if (!errorData.length || index - errorData.length < 0) return
      const nextErrorData = [...errorData]
      const [[address]] = nextErrorData.splice(idxErrData, 1)
      nextErrorData.unshift([address, nextAmount])
      dispatch(setErrorData({ errorData: nextErrorData }))
    }, [dispatch, errorData, idxErrData, index, nextAmount])

    const onDelete = useCallback(async () => {
      if (!errorData.length) return
      const nextErrData = [...errorData]
      nextErrData.splice(idxErrData, 1)
      dispatch(setErrorData({ errorData: nextErrData }))
    }, [dispatch, errorData, idxErrData])

    const onEdit = (visible: boolean) => {
      setIsEdited(visible)
      if (amountRef.current) amountRef.current.focus()
    }

    const validateAmount = useMemo(() => {
      if (!amountValue) return false
      if (!decimal && Number(amount) % 1 !== 0) return true
      return false
    }, [amount, amountValue, decimal])

    return (
      <Row gutter={[16, 8]} align="middle" justify="space-between" wrap={false}>
        <Col span={3}>
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
        <Col span={12}>
          <Tooltip title={accountAddress}>
            <Typography.Text style={{ color: isValidAddress ? '#F9575E' : '' }}>
              {shortenAddress(accountAddress)}
            </Typography.Text>
          </Tooltip>
        </Col>
        <Col span={6}>
          <NumericInput
            value={amountValue}
            bordered={isEdited}
            onChange={setNextAmount}
            disabled={!isEdited}
            style={{ padding: 0 }}
            className={
              validateAmount ? 'recipient-input-error' : 'recipient-input-auto'
            }
            ref={amountRef}
          />
        </Col>
        {!!errorData.length && (
          <Col span={3}>
            {editable && (
              <Space align="center">
                <AlertIcon editable={editable} wrongAddress={isValidAddress} />
                <EditButton
                  isEdited={isEdited}
                  wrongAddress={isValidAddress}
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
  },
)

export default AccountInfo
