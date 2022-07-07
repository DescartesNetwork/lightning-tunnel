import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { utilsBN } from 'sentre-web3'

import { Button, Col, Input, Row } from 'antd'
import NumericInput from '@sentre/antd-numeric-input'
import AddUnlockTime from '../addUnlockTime'
import DisplayUnlockTime from '../displayUnlockTime'
import ActionEditButton from './actionEditButton'
import CommonModal from 'components/commonModal'

import useMintDecimals from 'shared/hooks/useMintDecimals'
import { AppDispatch, AppState } from 'model'
import { setRecipient, RecipientInfo } from 'model/recipients.controller'
import useCalculateAmount from 'hooks/useCalculateAmount'

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
  const [visible, setVisible] = useState(false)
  const [replaceRecipient, setReplaceRecipient] = useState<RecipientInfo[]>([])
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
  const expirationTime = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const dispatch = useDispatch<AppDispatch>()
  const { calcListAmount } = useCalculateAmount()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }
  const onAmount = (val: string) => setFormInput({ ...formInput, amount: val })

  const amountError = useMemo(
    () => !isDecimals && Number(formInput.amount) % 1 !== 0,
    [formInput, isDecimals],
  )

  const ok = useMemo(() => {
    const { walletAddress, amount } = formInput
    if (!account.isAddress(walletAddress) || !amount || amountError)
      return false
    if (!nextUnlockTime.length) return false

    for (const unlockTime of nextUnlockTime) {
      if (!unlockTime) return false
      if (unlockTime > expirationTime && !!expirationTime) return false
    }
    return true
  }, [amountError, expirationTime, formInput, nextUnlockTime])

  const setNewRecipient = () => {
    if (!ok) return
    const { walletAddress: address, amount } = formInput

    const nextRecipients: RecipientInfo[] = []
    const decimalAmount = utilsBN.decimalize(amount, mintDecimals)
    const listAmount = calcListAmount(decimalAmount, nextUnlockTime.length)
    for (let i = 0; i < nextUnlockTime.length; i++) {
      const unlockTime = nextUnlockTime[i]
      nextRecipients.push({
        address,
        amount: utilsBN.undecimalize(listAmount[i], mintDecimals),
        unlockTime,
      })
    }

    //check recipient is existed
    if (recipientInfos[address] && !isEdit) {
      setReplaceRecipient(nextRecipients)
      return setVisible(true)
    }
    // apply for add new recipient
    if (!walletAddress) setFormInput(DEFAULT_RECIPIENT)
    setNextUnlockTime([])
    setIsEdit(false)
    return dispatch(setRecipient({ walletAddress: address, nextRecipients }))
  }

  const onReplace = () => {
    setNextUnlockTime([])
    setIsEdit(false)
    setVisible(false)
    // apply for add new recipient
    if (!walletAddress) setFormInput(DEFAULT_RECIPIENT)
    return dispatch(
      setRecipient({
        walletAddress: formInput.walletAddress,
        nextRecipients: replaceRecipient,
      }),
    )
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

  const walletAddrIndx = useMemo(() => {
    if (walletAddress && index !== undefined) return index + 1
    return Object.keys(recipientInfos).length + 1
  }, [index, recipientInfos, walletAddress])

  useEffect(() => {
    fetchDefaultUnlockTime()
  }, [fetchDefaultUnlockTime])

  useEffect(() => {
    fetchDefaultFormInput()
  }, [fetchDefaultFormInput])

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={24}>
        <Row>
          <Col flex="auto">Wallet address #{walletAddrIndx}</Col>
          <Col>
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
        </Row>
      </Col>
      <Col span={19}>
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
          className={amountError ? 'recipient-input-error' : 'recipient-input'}
          disabled={!isEdit && !!walletAddress}
        />
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
      <CommonModal
        btnText="Replace"
        description={'Do you want replace this recipient'}
        title={'Recipient existed'}
        onCancel={() => setVisible(false)}
        onConfirm={onReplace}
        setVisible={setVisible}
        visible={visible}
      />
    </Row>
  )
}

export default AddMoreRecipient
