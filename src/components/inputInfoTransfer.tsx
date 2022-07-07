import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useMemo,
  Fragment,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { utilsBN } from 'sentre-web3'
import BN from 'bn.js'

import { Col, Input, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import NumericInput from '@sentre/antd-numeric-input'
import ModalMerge from './commonModal'
import DistributionConfigDetail from 'view/vesting/addNewVesting/container/manual/distributionConfigDetail'
import ActionButton from './actionButton'
import UnlockTime from 'view/vesting/addNewVesting/components/unlockTime'

import { AppDispatch, AppState } from 'model'
import {
  setRecipient,
  RecipientInfo,
  removeRecipient,
} from 'model/recipients.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import useCalculateAmount from 'hooks/useCalculateAmount'
import { setIsTyping, TypeDistribute } from 'model/main.controller'
import Frequency, {
  FREQUENCY,
} from 'view/vesting/addNewVesting/components/frequency'
import DistributeIn, {
  DISTRIBUTE_IN_TIME,
} from 'view/vesting/addNewVesting/components/distributeIn'

type InputInfoTransferProps = {
  walletAddress?: string
  amount?: string
  index?: number
}

const DEFAULT_RECIPIENT = {
  walletAddress: '',
  amount: '',
}

const ONE_DAY = 24 * 60 * 60 * 1000

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
  const [nextFrequency, setNextFrequency] = useState(FREQUENCY.seven)
  const [nextDistributeIn, setNextDistributeIn] = useState(
    DISTRIBUTE_IN_TIME.three,
  )
  const [nextUnlockTime, setNextUnlockTime] = useState(0)
  const {
    main: { mintSelected, typeDistribute },
    recipients,
    setting: { decimal },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const { calcListAmount } = useCalculateAmount()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }

  const onAmount = (val: string) => setFormInput({ ...formInput, amount: val })

  const configs = useMemo(
    () => ({ distributeIn: nextDistributeIn, frequency: nextFrequency }),
    [nextDistributeIn, nextFrequency],
  )

  const addNewRecipient = async () => {
    const { walletAddress, amount } = formInput
    if (!account.isAddress(walletAddress))
      return setWalletError('Wrong wallet address')
    if (!amount) return setAmountError('Amount cannot be empty')
    if (!decimal && Number(amount) % 1 !== 0)
      return setAmountError('Should be natural numbers')
    const nextRecipients: RecipientInfo[] = []

    const { recipientInfos } = recipients
    if (recipientInfos[walletAddress] && !isEdit) return setVisible(true)

    if (typeDistribute === 'airdrop') {
      const recipient: RecipientInfo = {
        address: walletAddress,
        amount,
        unlockTime: nextUnlockTime,
      }
      nextRecipients.push(recipient)
    }
    if (typeDistribute === 'vesting') {
      const distributionAmount = Math.floor(
        (nextDistributeIn * 30) / nextFrequency,
      )
      const decimalAmount = utilsBN.decimalize(amount, mintDecimals)
      const actualAmount = calcListAmount(decimalAmount, distributionAmount)
      for (let i = 0; i < distributionAmount; i++) {
        let unlockTime = 0
        if (i === 0) unlockTime = nextUnlockTime
        if (i !== 0)
          unlockTime =
            nextFrequency * ONE_DAY + nextRecipients[i - 1].unlockTime
        const recipient: RecipientInfo = {
          address: walletAddress,
          amount: utilsBN.undecimalize(actualAmount[i], mintDecimals),
          unlockTime,
          configs,
        }
        nextRecipients.push(recipient)
      }
    }

    setWalletError('')
    setAmountError('')
    setIsEdit(false)
    if (!isEdit) setFormInput(DEFAULT_RECIPIENT)
    return dispatch(setRecipient({ walletAddress, nextRecipients }))
  }

  const onMerge = async () => {
    const { walletAddress, amount } = formInput
    const { recipientInfos } = recipients
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

  const fetchUnlockTime = useCallback(() => {
    const { globalUnlockTime, recipientInfos } = recipients
    if (!account.isAddress(walletAddress))
      return setNextUnlockTime(globalUnlockTime)
    return setNextUnlockTime(recipientInfos[walletAddress][0].unlockTime)
  }, [recipients, walletAddress])

  const fetchConfigs = useCallback(() => {
    const { globalConfigs, recipientInfos } = recipients
    if (!account.isAddress(walletAddress)) {
      setNextDistributeIn(globalConfigs.distributeIn)
      return setNextFrequency(globalConfigs.frequency)
    }
    const itemConfig = recipientInfos[walletAddress][0].configs
    if (!itemConfig) return
    setNextDistributeIn(itemConfig.distributeIn)
    return setNextFrequency(itemConfig.frequency)
  }, [recipients, walletAddress])

  const walletAddrIndx = useMemo(() => {
    if (walletAddress && index !== undefined) return index + 1
    return Object.keys(recipients.recipientInfos).length + 1
  }, [index, recipients.recipientInfos, walletAddress])

  const disabledInput = walletAddress && !isEdit ? true : false

  const disabledSave = useMemo(() => {
    const time = nextUnlockTime + nextDistributeIn * 30 * ONE_DAY
    const expirationTime = recipients.expirationTime
    if (!expirationTime) return false //unlimited
    return (
      (nextUnlockTime > expirationTime || time > expirationTime) &&
      typeDistribute === TypeDistribute.Vesting
    )
  }, [
    nextDistributeIn,
    nextUnlockTime,
    recipients.expirationTime,
    typeDistribute,
  ])

  useEffect(() => {
    recipientInfo()
  }, [recipientInfo])

  useEffect(() => {
    validateAmount()
  }, [validateAmount])

  useEffect(() => {
    checkIsTyping()
  }, [checkIsTyping])

  useEffect(() => {
    fetchConfigs()
    fetchUnlockTime()
  }, [fetchConfigs, fetchUnlockTime])

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
      {/* Only for Vesting */}
      {typeDistribute === TypeDistribute.Vesting && (
        <Fragment>
          {isEdit ? (
            <Col span={24}>
              <Row gutter={[16, 16]}>
                <Col xs={12} md={7}>
                  <UnlockTime
                    unlockTime={nextUnlockTime}
                    onChange={setNextUnlockTime}
                  />
                </Col>
                <Col xs={12} md={7}>
                  <Frequency
                    frequency={nextFrequency}
                    onChange={setNextFrequency}
                  />
                </Col>
                <Col xs={12} md={7}>
                  <DistributeIn
                    distributeIn={nextDistributeIn}
                    onChange={setNextDistributeIn}
                  />
                </Col>
              </Row>
            </Col>
          ) : (
            <Col span={24}>
              <DistributionConfigDetail
                configs={configs}
                unlockTime={nextUnlockTime}
              />
            </Col>
          )}
        </Fragment>
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
