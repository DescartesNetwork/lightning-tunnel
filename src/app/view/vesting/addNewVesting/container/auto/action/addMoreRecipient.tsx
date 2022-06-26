import { ChangeEvent, useMemo, useState } from 'react'

import { Button, Col, Input, Row } from 'antd'
import NumericInput from '@sentre/antd-numeric-input'
import AddUnlockTime from '../../../components/addUnlockTime'
import { account, utils } from '@senswap/sen-js'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'app/model'
import { addRecipient, RecipientInfo } from 'app/model/recipients.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'

const DEFAULT_RECIPIENT = {
  walletAddress: '',
  amount: '',
}

const AddMoreRecipient = () => {
  const [formInput, setFormInput] = useState(DEFAULT_RECIPIENT)
  const [listUnlockTime, setListUnlockTime] = useState<number[]>([])
  const isDecimals = useSelector((state: AppState) => state.setting.decimal)
  const mintSelected = useSelector((state: AppState) => state.main.mintSelected)
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
    if (!listUnlockTime.length) return false

    for (const unlockTime of listUnlockTime) {
      if (!unlockTime) return false
    }
    return true
  }, [formInput, isDecimals, listUnlockTime])

  const addNewRecipient = () => {
    if (!ok) return
    const { walletAddress, amount } = formInput
    const nextRecipients: RecipientInfo[] = []
    const newAmount =
      utils.decimalize(amount, mintDecimals) / BigInt(listUnlockTime.length)

    for (const unlockTime of listUnlockTime) {
      nextRecipients.push({
        address: walletAddress,
        amount: utils.undecimalize(newAmount, mintDecimals),
        unlockTime,
      })
    }
    setListUnlockTime([])
    setFormInput(DEFAULT_RECIPIENT)
    return dispatch(addRecipient({ walletAddress, nextRecipients }))
  }

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
        />
      </Col>
      <Col span={1}>
        <Button
          type="text"
          size="small"
          style={{ padding: 0, color: '#42E6EB' }}
          onClick={addNewRecipient}
          disabled={!ok}
        >
          OK
        </Button>
      </Col>
      <Col span={24}>
        <AddUnlockTime
          listUnlockTime={listUnlockTime}
          setListUnlockTime={setListUnlockTime}
        />
      </Col>
    </Row>
  )
}

export default AddMoreRecipient
