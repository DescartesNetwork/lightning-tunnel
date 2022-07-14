import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IonIcon from '@sentre/antd-ionicon'
import { account } from '@senswap/sen-js'
import moment from 'moment'

import { Button, Col, DatePicker, Input, Row, Space, Typography } from 'antd'
import NumericInput from '@sentre/antd-numeric-input'

import { AppDispatch, AppState } from 'model'
import { setRecipient, RecipientInfo } from 'model/recipients.controller'
import { setIsTyping } from 'model/main.controller'

const DEFAULT_RECIPIENT = {
  walletAddress: '',
  amount: '',
}

const AddMore = () => {
  const [formInput, setFormInput] = useState(DEFAULT_RECIPIENT)
  const [unlockTime, setUnlockTime] = useState(0)
  const [amountError, setAmountError] = useState('')
  const [walletError, setWalletError] = useState('')
  const decimal = useSelector((state: AppState) => state.setting.decimal)
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )
  const expirationTime = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  const dispatch = useDispatch<AppDispatch>()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }
  const onAmount = (val: string) => setFormInput({ ...formInput, amount: val })

  const setNewRecipient = () => {
    const { walletAddress, amount } = formInput
    if (!account.isAddress(walletAddress))
      return setWalletError('Wrong wallet address')
    if (!amount) return setAmountError('Amount cannot be empty')
    if (!decimal && Number(amount) % 1 !== 0)
      return setAmountError('Should be natural numbers')
    let nextRecipients: RecipientInfo[] = []

    /** Airdrop */
    const recipient: RecipientInfo = {
      address: walletAddress,
      amount,
      unlockTime,
    }
    nextRecipients.push(recipient)

    if (recipientInfos[walletAddress]) {
      const oldData = [...recipientInfos[walletAddress]]
      nextRecipients = oldData.concat(nextRecipients)
    }
    setFormInput(DEFAULT_RECIPIENT)
    setWalletError('')
    setAmountError('')
    setUnlockTime(0)
    return dispatch(setRecipient({ walletAddress, nextRecipients }))
  }

  const checkIsTyping = useCallback(() => {
    if (formInput.walletAddress || formInput.amount)
      return dispatch(setIsTyping(true))
    return dispatch(setIsTyping(false))
  }, [dispatch, formInput.amount, formInput.walletAddress])

  const disabled = useMemo(() => {
    const { walletAddress, amount } = formInput
    if (!account.isAddress(walletAddress) || !amount) return true
    if (!unlockTime || (unlockTime > expirationTime && expirationTime))
      return true
    return false
  }, [expirationTime, formInput, unlockTime])

  useEffect(() => {
    checkIsTyping()
  }, [checkIsTyping])

  return (
    <Row
      gutter={[16, 16]}
      align="middle"
      style={{ padding: '12px 16px', background: '#394747' }}
    >
      <Col xs={24} md={12} xl={15}>
        <Input
          value={formInput.walletAddress}
          name="walletAddress"
          placeholder="Wallet address"
          onChange={onChange}
          className="recipient-input"
          autoComplete="off"
        />
      </Col>
      <Col xs={24} md={5} xl={4}>
        <DatePicker
          placeholder="Select time"
          suffixIcon={<IonIcon name="time-outline" />}
          className="date-option"
          onChange={(date) => setUnlockTime(date?.valueOf() || 0)}
          clearIcon={null}
          showTime={{ showSecond: false }}
          value={unlockTime ? moment(unlockTime) : null}
          placement="bottomRight"
        />
      </Col>
      <Col xs={24} md={5} xl={4}>
        <NumericInput
          value={formInput.amount}
          name="amount"
          placeholder="Amount"
          onChange={onAmount}
          autoComplete="off"
          className="recipient-input"
        />
      </Col>

      <Col xs={24} md={2} xl={1}>
        <Button
          type="text"
          size="small"
          style={{ padding: 0, color: '#42E6EB' }}
          onClick={setNewRecipient}
          disabled={disabled}
        >
          ok
        </Button>
      </Col>
      {(walletError || amountError) && (
        <Col span={24}>
          <Space>
            <IonIcon style={{ color: '#f2323f' }} name="warning-outline" />
            <Typography.Text type="danger">
              {walletError || amountError}
            </Typography.Text>
          </Space>
        </Col>
      )}
    </Row>
  )
}

export default AddMore
