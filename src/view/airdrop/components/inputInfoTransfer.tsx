import { ChangeEvent, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { utilsBN } from '@sen-use/web3'
import parse from 'parse-duration'
import BN from 'bn.js'

import { Col, Input, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import NumericInput from '@sentre/antd-numeric-input'
import ModalMerge from 'components/commonModal'
import ActionButton from 'components/actionButton'

import { AppDispatch, AppState } from 'model'
import {
  setRecipient,
  RecipientInfo,
  removeRecipient,
} from 'model/recipients.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import useCalculateAmount from 'hooks/useCalculateAmount'
import { setIsTyping, TypeDistribute } from 'model/main.controller'

type InputInfoTransferProps = {
  walletAddress?: string
  amount?: string
  index?: number
}

const DEFAULT_RECIPIENT = {
  walletAddress: '',
  amount: '',
}

const InputInfoTransfer = ({
  walletAddress,
  amount,
  index,
}: InputInfoTransferProps) => {
  const [formInput, setFormInput] = useState(DEFAULT_RECIPIENT)
  const [amountError, setAmountError] = useState('')
  const [walletError, setWalletError] = useState('')
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const {
    main: { mintSelected, typeDistribute },
    recipients: {
      recipientInfos,
      configs: globalConfigs,
      globalUnlockTime,
      expirationTime,
    },
    setting: { decimal },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const { calcListAmount } = useCalculateAmount()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }

  const onAmount = (val: string) => setFormInput({ ...formInput, amount: val })

  const addNewRecipient = async () => {
    const { walletAddress, amount } = formInput
    if (!account.isAddress(walletAddress))
      return setWalletError('Wrong wallet address')
    if (!amount) return setAmountError('Amount cannot be empty')
    if (!decimal && Number(amount) % 1 !== 0)
      return setAmountError('Should be natural numbers')
    const nextRecipients: RecipientInfo[] = []
    if (recipientInfos[walletAddress] && !isEdit) return setVisible(true)

    /** Airdrop */
    const recipient: RecipientInfo = {
      address: walletAddress,
      amount,
      unlockTime: globalUnlockTime,
    }
    nextRecipients.push(recipient)

    setWalletError('')
    setAmountError('')
    setIsEdit(false)
    if (!isEdit) setFormInput(DEFAULT_RECIPIENT)
    return dispatch(setRecipient({ walletAddress, nextRecipients }))
  }

  const onMerge = async () => {
    const { walletAddress, amount } = formInput
    const recipientData = recipientInfos[walletAddress]
    const amountRecipient = recipientData.length

    let oldAmount = new BN(0)
    for (const { amount } of recipientData) {
      oldAmount = oldAmount.add(utilsBN.decimalize(amount, mintDecimals))
    }

    const newAmount = oldAmount.add(utilsBN.decimalize(amount, mintDecimals))
    const listAmount = calcListAmount(newAmount, amountRecipient)
    const nextRecipients = recipientInfos[walletAddress].map(
      (recipient, index) => {
        return {
          ...recipient,
          amount: utilsBN.undecimalize(listAmount[index], mintDecimals),
        }
      },
    )

    await dispatch(setRecipient({ walletAddress, nextRecipients }))
    await setVisible(false)
    if (amountError || walletError) {
      setAmountError('')
      setWalletError('')
    }
    return setFormInput(DEFAULT_RECIPIENT)
  }

  const onRemove = () => {
    if (!account.isAddress(walletAddress)) return
    return dispatch(removeRecipient(walletAddress))
  }

  const recipientInfo = useCallback(async () => {
    if (account.isAddress(walletAddress) && amount) {
      return setFormInput({ walletAddress, amount })
    }
    return setFormInput(DEFAULT_RECIPIENT)
  }, [walletAddress, amount])

  const checkIsTyping = useCallback(() => {
    if ((amount || walletAddress) && !isEdit)
      return dispatch(setIsTyping(false))
    if (formInput.walletAddress || formInput.amount || isEdit)
      return dispatch(setIsTyping(true))
    return dispatch(setIsTyping(false))
  }, [
    amount,
    dispatch,
    formInput.amount,
    formInput.walletAddress,
    isEdit,
    walletAddress,
  ])

  const validateAmount = useCallback(() => {
    if (!amount) return
    if (decimal) return setAmountError('')
    if (Number(amount) % 1 !== 0)
      return setAmountError('Should be natural numbers')
  }, [amount, decimal])

  const walletAddrIndx = useMemo(() => {
    if (walletAddress && index !== undefined) return index + 1
    return Object.keys(recipientInfos).length + 1
  }, [index, recipientInfos, walletAddress])

  const disabledInput = walletAddress && !isEdit ? true : false

  const disabledSave = useMemo(() => {
    const { distributeIn } = globalConfigs
    const time = globalUnlockTime + parse(distributeIn)

    if (!expirationTime) return false //unlimited
    return (
      (globalUnlockTime > expirationTime || time > expirationTime) &&
      typeDistribute === TypeDistribute.Vesting
    )
  }, [expirationTime, globalConfigs, globalUnlockTime, typeDistribute])

  useEffect(() => {
    recipientInfo()
  }, [recipientInfo])

  useEffect(() => {
    validateAmount()
  }, [validateAmount])

  useEffect(() => {
    checkIsTyping()
  }, [checkIsTyping])

  return (
    <Row gutter={[8, 8]} align="middle" justify="space-between">
      <Col span={24}>
        <Row>
          <Col flex="auto">Wallet address #{walletAddrIndx}</Col>
          <Col>
            <ActionButton
              addNewRecipient={addNewRecipient}
              walletAddress={walletAddress}
              remove={onRemove}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              disabled={disabledSave}
            />
          </Col>
        </Row>
      </Col>
      <Col span={19}>
        <Input
          disabled={!!walletAddress}
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
          disabled={disabledInput}
          value={amount ? amount : formInput.amount}
          name="amount"
          placeholder="Amount"
          onChange={onAmount}
          className={amountError ? 'recipient-input-error' : 'recipient-input'}
          autoComplete="off"
        />
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

      <ModalMerge
        title="Do you want to merge wallet addresses?"
        description="There are some wallet addresses that are the same."
        btnText="merge"
        onConfirm={onMerge}
        visible={visible}
        setVisible={setVisible}
        onCancel={() => setVisible(false)}
      />
    </Row>
  )
}

export default InputInfoTransfer
