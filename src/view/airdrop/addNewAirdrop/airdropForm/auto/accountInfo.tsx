import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { util } from '@sentre/senhub'

import {
  Col,
  Row,
  Space,
  Typography,
  Tooltip,
  Checkbox,
  Button,
  Input,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import NumericInput from '@sentre/antd-numeric-input'

import { AppDispatch, AppState } from 'model'
import {
  addAmountAndTime,
  RecipientInfo,
  removeRecipient,
} from 'model/recipients.controller'
import { setIsTyping } from 'model/main.controller'

type AccountInfoProps = {
  accountAddress?: string
  selected?: boolean
  email?: string
  amount?: number | string
  index: number
  onChecked?: (checked: boolean, walletAddress: string) => void
}

const AccountInfo = ({
  accountAddress = '',
  amount = 0,
  selected = false,
  onChecked = () => {},
  index,
}: AccountInfoProps) => {
  const [isEdit, setIsEdit] = useState(false)
  const [nextAmount, setNextAmount] = useState(amount)
  const selectedFile = useSelector((state: AppState) => state.file.selectedFile)
  const decimal = useSelector((state: AppState) => state.setting.decimal)
  const unlockTime = useSelector(
    (state: AppState) => state.recipients.globalUnlockTime,
  )
  const dispatch = useDispatch<AppDispatch>()
  const isValidAddress = account.isAddress(accountAddress)

  const validateAmount = useMemo(() => {
    if (!amount) return false
    if (!decimal && Number(amount) % 1 !== 0) return true
    return false
  }, [amount, decimal])

  const onSave = () => {
    if (!isValidAddress) return
    const nextRecipientInfos: RecipientInfo[] = [
      { address: accountAddress, amount: nextAmount.toString(), unlockTime },
    ]
    dispatch(
      addAmountAndTime({ walletAddress: accountAddress, nextRecipientInfos }),
    )
    return setIsEdit(false)
  }

  const checkIsTyping = useCallback(() => {
    if (isEdit) return dispatch(setIsTyping(true))
    return dispatch(setIsTyping(false))
  }, [dispatch, isEdit])

  useEffect(() => {
    setNextAmount(amount)
  }, [amount])

  useEffect(() => {
    checkIsTyping()
  }, [checkIsTyping])

  return (
    <Row gutter={[16, 8]} align="middle" className="vesting-item">
      <Col span={2}>
        <Space>
          {selected && (
            <Checkbox
              checked={selectedFile?.includes(accountAddress)}
              onChange={(e) => onChecked(e.target.checked, accountAddress)}
              className="lightning-checkbox"
            />
          )}
          <Typography.Text type="secondary">#{index + 1}</Typography.Text>
        </Space>
      </Col>
      <Col span={14}>
        {isEdit ? (
          <Input
            value={accountAddress}
            name="accountAddress"
            className="recipient-input"
            autoComplete="off"
            disabled={true}
          />
        ) : (
          <Tooltip title={accountAddress}>
            <Typography.Text style={{ color: isValidAddress ? '' : '#F9575E' }}>
              {util.shortenAddress(accountAddress)}
            </Typography.Text>
          </Tooltip>
        )}
      </Col>

      <Col span={4}>
        {isEdit ? (
          <NumericInput
            value={nextAmount}
            bordered={false}
            style={{ padding: 0 }}
            onChange={(val: string) => {
              setNextAmount(val)
            }}
            className={
              validateAmount ? 'recipient-input-error' : 'recipient-input'
            }
          />
        ) : (
          <Typography.Text style={{ color: validateAmount ? '#F9575E' : '' }}>
            {nextAmount}
          </Typography.Text>
        )}
      </Col>
      <Col span={4} className={!isEdit ? 'vesting-action' : ''}>
        {isEdit ? (
          <Space>
            <Button onClick={() => setIsEdit(false)} type="text">
              cancel
            </Button>
            <Button
              style={{ padding: 0, color: '#42E6EB' }}
              onClick={onSave}
              type="text"
            >
              save
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              onClick={() => dispatch(removeRecipient(accountAddress))}
              icon={<IonIcon name="trash-outline" />}
              type="text"
            />
            {isValidAddress && (
              <Button
                onClick={() => setIsEdit(true)}
                icon={<IonIcon name="create-outline" />}
                type="text"
              />
            )}
          </Space>
        )}
      </Col>
    </Row>
  )
}

export default AccountInfo
