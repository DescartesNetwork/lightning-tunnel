import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'

import { Button, Checkbox, Col, Input, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import NumericInput from '@sentre/antd-numeric-input'
import ModalMerge from './commonModal'

import { AppState } from 'app/model'
import {
  addRecipient,
  RecipientInfo,
  removeRecipient,
} from 'app/model/recipients.controller'
import { selectRecipient } from 'app/model/file.controller'
import { setIsTyping } from 'app/model/main.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'

type InputInfoTransferProps = {
  walletAddress?: string
  amount?: string
  index?: number
  isSelect?: boolean
}

const DEFAULT_RECIPIENT = {
  walletAddress: '',
  amount: '',
}

const ONE_DAY = 24 * 60 * 60 * 1000

const ActionButton = ({
  walletAddress,
  addNewRecipient,
  remove,
}: {
  walletAddress?: string
  addNewRecipient: () => void
  remove: () => void
}) => {
  return (
    <Fragment>
      {walletAddress ? (
        <Button
          type="text"
          size="small"
          style={{ padding: 0 }}
          onClick={remove}
          icon={<IonIcon style={{ fonSize: 20 }} name="trash-outline" />}
        />
      ) : (
        <Button
          type="text"
          size="small"
          style={{ padding: 0, color: '#42E6EB' }}
          onClick={addNewRecipient}
        >
          OK
        </Button>
      )}
    </Fragment>
  )
}

const InputInfoTransfer = ({
  walletAddress,
  amount,
  index,
  isSelect = false,
}: InputInfoTransferProps) => {
  const [formInput, setRecipient] = useState(DEFAULT_RECIPIENT)
  const [amountError, setAmountError] = useState('')
  const [walletError, setWalletError] = useState('')
  const [visible, setVisible] = useState(false)
  const {
    main: { mintSelected, typeDistribute },
    recipients,
    setting: { decimal },
    file: { selectedFile },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipient({ ...formInput, [e.target.name]: e.target.value })
  }

  const onAmount = (val: string) => setRecipient({ ...formInput, amount: val })

  const onSelected = (checked: boolean, walletAddress: string) =>
    dispatch(selectRecipient({ checked, walletAddress }))

  const recipientInfo = useCallback(async () => {
    if (account.isAddress(walletAddress) && amount) {
      return setRecipient({ walletAddress, amount })
    }
    return setRecipient(DEFAULT_RECIPIENT)
  }, [walletAddress, amount])

  const addNewRecipient = async () => {
    const { walletAddress, amount } = formInput
    if (!account.isAddress(walletAddress))
      return setWalletError('Wrong wallet address')
    if (!amount) return setAmountError('Amount cannot be empty')
    const nextRecipients: RecipientInfo[] = []

    const { recipientInfos, globalConfigs, globalUnlockTime } = recipients
    if (recipientInfos[walletAddress]) return setVisible(true)

    if (typeDistribute === 'airdrop') {
      const recipient: RecipientInfo = {
        address: walletAddress,
        amount: amount,
        unlockTime: globalUnlockTime,
      }
      nextRecipients.push(recipient)
    }

    if (typeDistribute === 'vesting') {
      const { distributeIn, frequency } = globalConfigs
      const distributionAmount = Math.floor((distributeIn * 30) / frequency)
      const actualAmount = Number(amount) / distributionAmount

      for (let i = 0; i < distributionAmount; i++) {
        let unlockTime = 0
        if (i === 0) unlockTime = globalUnlockTime
        if (i !== 0)
          unlockTime = frequency * ONE_DAY + nextRecipients[i - 1].unlockTime

        const recipient: RecipientInfo = {
          address: walletAddress,
          amount: actualAmount.toString(),
          unlockTime: unlockTime,
          configs: globalConfigs,
        }
        nextRecipients.push(recipient)
      }
    }

    setWalletError('')
    setAmountError('')
    await dispatch(addRecipient({ walletAddress, nextRecipients }))
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const onMerge = async () => {
    const { walletAddress, amount } = formInput
    const { recipientInfos } = recipients
    const amountRecipient = recipientInfos[walletAddress].length
    const oldAmount =
      amountRecipient * Number(recipientInfos[walletAddress][0].amount)
    const decimalAmount =
      utils.decimalize(oldAmount, mintDecimals) +
      utils.decimalize(amount, mintDecimals)

    const actualAmount = utils.undecimalize(decimalAmount, mintDecimals)

    const nextRecipients = recipientInfos[walletAddress].map((recipient) => {
      return {
        ...recipient,
        amount: (Number(actualAmount) / amountRecipient).toString(),
      }
    })

    await dispatch(addRecipient({ walletAddress, nextRecipients }))
    await setVisible(false)
    if (amountError || walletError) {
      setAmountError('')
      setWalletError('')
    }
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const onRemove = () => {
    if (!account.isAddress(walletAddress)) return
    return dispatch(removeRecipient(walletAddress))
  }

  const checkIsTyping = useCallback(() => {
    if (amount || walletAddress) return
    if (formInput.walletAddress || formInput.amount)
      return dispatch(setIsTyping(true))
    return dispatch(setIsTyping(false))
  }, [
    amount,
    dispatch,
    formInput.amount,
    formInput.walletAddress,
    walletAddress,
  ])

  const validateAmount = useCallback(() => {
    if (!amount) return
    if (decimal) return setAmountError('')
    if (Number(amount) % 1 !== 0)
      return setAmountError('Should be natural numbers')
  }, [amount, decimal])

  const disabledInput = walletAddress ? true : false

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
      {isSelect && (
        <Col>
          <Checkbox
            checked={selectedFile?.includes(walletAddress || '')}
            onChange={(e) => onSelected(e.target.checked, walletAddress || '')}
          />
        </Col>
      )}
      <Col span={18}>
        <Input
          disabled={disabledInput}
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
      {!isSelect && (
        <Col span={1}>
          <ActionButton
            addNewRecipient={addNewRecipient}
            walletAddress={walletAddress}
            remove={onRemove}
          />
        </Col>
      )}
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
