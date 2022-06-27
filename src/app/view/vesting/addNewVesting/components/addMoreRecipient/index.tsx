import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'

import { Button, Col, Input, Row } from 'antd'
import NumericInput from '@sentre/antd-numeric-input'
import AddUnlockTime from '../addUnlockTime'
import DisplayUnlockTime from '../displayUnlockTime'
import ActionEditButton from './actionEditButton'

import useMintDecimals from 'shared/hooks/useMintDecimals'
import { AppDispatch, AppState } from 'app/model'
import { setRecipient, RecipientInfo } from 'app/model/recipients.controller'

const DEFAULT_RECIPIENT = {
  walletAddress: '',
  amount: '',
}

type AddMoreRecipientProps = {
  walletAddress?: string
  amount?: string
  index?: number
}

const AddMoreRecipient = ({
  walletAddress,
  amount,
  index,
}: AddMoreRecipientProps) => {
  const [formInput, setFormInput] = useState(DEFAULT_RECIPIENT)
  const [isEdit, setIsEdit] = useState(false)
  const [nextUnlockTime, setNextUnlockTime] = useState<number[]>([])
  const isDecimals = useSelector((state: AppState) => state.setting.decimal)
  const mintSelected = useSelector((state: AppState) => state.main.mintSelected)
  const listUnlockTime = useSelector(
    (state: AppState) => state.advancedMode.listUnlockTime,
  )
  const advanced = useSelector(
    (state: AppState) => state.advancedMode.isAdvancedMode,
  )
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const dispatch = useDispatch<AppDispatch>()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }
  const onAmount = (val: string) => setFormInput({ ...formInput, amount: val })

  const ok = useMemo(() => {
    const { walletAddress, amount } = formInput
    if (!account.isAddress(walletAddress) || !amount) return false
    if (!isDecimals && Number(amount) % 1 !== 0) return false
    if (!nextUnlockTime.length) return false

    for (const unlockTime of nextUnlockTime) {
      if (!unlockTime) return false
    }
    return true
  }, [formInput, isDecimals, nextUnlockTime])

  const setNewRecipient = () => {
    if (!ok) return
    const { walletAddress: address, amount } = formInput
    const nextRecipients: RecipientInfo[] = []
    const newAmount =
      utils.decimalize(amount, mintDecimals) / BigInt(nextUnlockTime.length)

    for (const unlockTime of nextUnlockTime) {
      nextRecipients.push({
        address,
        amount: utils.undecimalize(newAmount, mintDecimals),
        unlockTime,
      })
    }
    if (!walletAddress) setFormInput(DEFAULT_RECIPIENT) // apply for add new recipient
    setNextUnlockTime([])
    setIsEdit(false)
    return dispatch(setRecipient({ walletAddress: address, nextRecipients }))
  }

  const fetchDefaultUnlockTime = useCallback(() => {
    if (!account.isAddress(walletAddress) || !walletAddress)
      return setNextUnlockTime(listUnlockTime)
    const data = recipientInfos[walletAddress]
    const nextUnlockTime: number[] = []
    for (const { unlockTime } of data) nextUnlockTime.push(unlockTime)
    return setNextUnlockTime(nextUnlockTime)
  }, [listUnlockTime, recipientInfos, walletAddress])

  const fetchDefaultFormInput = useCallback(() => {
    if (!account.isAddress(walletAddress) || !amount || !walletAddress)
      return setFormInput(DEFAULT_RECIPIENT)
    return setFormInput({ walletAddress, amount })
  }, [amount, walletAddress])

  useEffect(() => {
    fetchDefaultUnlockTime()
  }, [fetchDefaultUnlockTime])

  useEffect(() => {
    fetchDefaultFormInput()
  }, [fetchDefaultFormInput])

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={18}>
        <Input
          value={formInput.walletAddress}
          name="walletAddress"
          placeholder="Wallet address"
          onChange={onChange}
          className="recipient-input"
          autoComplete="off"
          disabled={!isEdit && !!walletAddress}
        />
      </Col>
      <Col span={5}>
        <NumericInput
          value={formInput.amount}
          name="amount"
          placeholder="Amount"
          onChange={onAmount}
          autoComplete="off"
          className={false ? 'recipient-input-error' : 'recipient-input'}
          disabled={!isEdit && !!walletAddress}
        />
      </Col>
      <Col span={1}>
        {!walletAddress ? (
          <Button
            type="text"
            size="small"
            style={{ padding: 0, color: '#42E6EB' }}
            onClick={setNewRecipient}
            disabled={!ok}
          >
            OK
          </Button>
        ) : (
          <ActionEditButton
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            onSave={setNewRecipient}
          />
        )}
      </Col>
      <Col span={24}>
        {!isEdit && advanced ? (
          <DisplayUnlockTime listUnlockTime={nextUnlockTime} />
        ) : (
          <AddUnlockTime
            listUnlockTime={nextUnlockTime}
            setListUnlockTime={setNextUnlockTime}
          />
        )}
      </Col>
    </Row>
  )
}

export default AddMoreRecipient
