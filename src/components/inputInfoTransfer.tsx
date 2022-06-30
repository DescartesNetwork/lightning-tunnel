import {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'

import { Button, Col, Input, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import NumericInput from '@sentre/antd-numeric-input'
import ModalMerge from './commonModal'

import { AppState } from 'model'
import {
  setRecipient,
  RecipientInfo,
  removeRecipient,
} from 'model/recipients.controller'
import { setIsTyping } from 'model/main.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'

type InputInfoTransferProps = {
  walletAddress?: string
  amount?: string
  index?: number
  isEdit?: boolean
  setIsEdit?: (value: boolean) => void
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
  isEdit = false,
  setIsEdit = () => {},
}: {
  walletAddress?: string
  addNewRecipient: () => void
  remove: () => void
  isEdit?: boolean
  setIsEdit?: (value: boolean) => void
}) => {
  return (
    <Fragment>
      {walletAddress ? (
        <Fragment>
          {!isEdit ? (
            <Button
              type="text"
              size="small"
              style={{ padding: 0 }}
              onClick={remove}
              icon={<IonIcon style={{ fonSize: 20 }} name="trash-outline" />}
            />
          ) : (
            <Button type="text" size="small">
              Save
            </Button>
          )}
        </Fragment>
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
  isEdit = false,
  setIsEdit,
}: InputInfoTransferProps) => {
  const [formInput, setFormInput] = useState(DEFAULT_RECIPIENT)
  const [amountError, setAmountError] = useState('')
  const [walletError, setWalletError] = useState('')
  const [visible, setVisible] = useState(false)
  const {
    main: { mintSelected, typeDistribute },
    recipients,
    setting: { decimal },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }

  const onAmount = (val: string) => setFormInput({ ...formInput, amount: val })

  const recipientInfo = useCallback(async () => {
    if (account.isAddress(walletAddress) && amount) {
      return setFormInput({ walletAddress, amount })
    }
    return setFormInput(DEFAULT_RECIPIENT)
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
        amount,
        unlockTime: globalUnlockTime,
      }
      nextRecipients.push(recipient)
    }

    if (typeDistribute === 'vesting') {
      const { distributeIn, frequency } = globalConfigs
      const distributionAmount = Math.floor((distributeIn * 30) / frequency)
      const decimalAmount = utils.decimalize(amount, mintDecimals)
      const singleAmount = decimalAmount / BigInt(distributionAmount)

      for (let i = 0; i < distributionAmount; i++) {
        let unlockTime = 0
        let actualAmount = singleAmount
        if (i === 0) unlockTime = globalUnlockTime
        if (i !== 0)
          unlockTime = frequency * ONE_DAY + nextRecipients[i - 1].unlockTime

        if (i === distributionAmount - 1) {
          let restAmount = 0
          for (const { amount } of nextRecipients) restAmount += Number(amount)

          actualAmount = utils.decimalize(
            Number(amount) - restAmount,
            mintDecimals,
          )
        }

        const recipient: RecipientInfo = {
          address: walletAddress,
          amount: utils.undecimalize(actualAmount, mintDecimals),
          unlockTime: unlockTime,
          configs: globalConfigs,
        }
        nextRecipients.push(recipient)
      }
    }

    setWalletError('')
    setAmountError('')
    await dispatch(setRecipient({ walletAddress, nextRecipients }))
    return setFormInput(DEFAULT_RECIPIENT)
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

  const walletAddrIndx = useMemo(() => {
    if (walletAddress && index !== undefined) return index + 1
    return Object.keys(recipients.recipientInfos).length + 1
  }, [index, recipients.recipientInfos, walletAddress])

  const disabledInput = walletAddress && !isEdit ? true : false

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
            />
          </Col>
        </Row>
      </Col>
      <Col span={19}>
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
