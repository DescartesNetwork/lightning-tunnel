import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { utilsBN } from '@sen-use/web3'
import BN from 'bn.js'
import parse from 'parse-duration'

import { Button, Col, Input, Row, Space, Typography } from 'antd'
import NumericInput from '@sentre/antd-numeric-input'
import CommonModal from 'components/commonModal'

import useMintDecimals from 'shared/hooks/useMintDecimals'
import { AppDispatch, AppState } from 'model'
import { setRecipient, RecipientInfo } from 'model/recipients.controller'
import useCalculateAmount from 'hooks/useCalculateAmount'
import { setIsTyping } from 'model/main.controller'
import { account } from '@senswap/sen-js'
import IonIcon from '@sentre/antd-ionicon'

const DEFAULT_RECIPIENT = {
  walletAddress: '',
  amount: '',
}

const AddRecipient = () => {
  const [formInput, setFormInput] = useState(DEFAULT_RECIPIENT)
  const [visible, setVisible] = useState(false)
  const [amountError, setAmountError] = useState('')
  const [walletError, setWalletError] = useState('')
  const [replaceRecipient, setReplaceRecipient] = useState<RecipientInfo[]>([])
  const configs = useSelector((state: AppState) => state.recipients.configs)
  const TGE = useSelector((state: AppState) => state.main.TGE)
  const TGETime = useSelector((state: AppState) => state.main.TGETime)
  const mintSelected = useSelector((state: AppState) => state.main.mintSelected)
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )
  const cliff = useSelector((state: AppState) => state.recipients.configs.cliff)
  const decimal = useSelector((state: AppState) => state.setting.decimal)
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const dispatch = useDispatch<AppDispatch>()
  const { calcListAmount } = useCalculateAmount()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value })
  }
  const onAmount = (val: string) => setFormInput({ ...formInput, amount: val })

  const setNewRecipient = () => {
    const { walletAddress: address, amount } = formInput

    if (!account.isAddress(address))
      return setWalletError('Wrong wallet address')
    if (!amount) return setAmountError('Amount cannot be empty')
    if (!decimal && Number(amount) % 1 !== 0)
      return setAmountError('Should be natural numbers')

    const { distributeIn, frequency } = configs
    let decimalAmount = utilsBN.decimalize(amount, mintDecimals)
    const distributionAmount = Math.floor(
      parse(distributeIn) / parse(frequency),
    )
    const nextRecipients: RecipientInfo[] = []

    const amountTge = TGE
      ? decimalAmount.mul(new BN(TGE)).div(new BN(100))
      : new BN(0)
    decimalAmount = decimalAmount.sub(amountTge)
    const recipient: RecipientInfo = {
      address,
      amount: utilsBN.undecimalize(amountTge, mintDecimals),
      unlockTime: TGETime,
    }
    nextRecipients.push(recipient)
    const listAmount = calcListAmount(decimalAmount, distributionAmount)
    for (let i = 1; i <= distributionAmount; i++) {
      let unlockTime = 0

      if (i === 1) unlockTime = TGETime + parse(cliff)
      if (i > 1) {
        unlockTime = parse(frequency) + nextRecipients[i - 1].unlockTime
      }
      const recipient: RecipientInfo = {
        address,
        amount: utilsBN.undecimalize(listAmount[i - 1], mintDecimals),
        unlockTime,
      }
      nextRecipients.push(recipient)
    }

    //check recipient is existed
    if (recipientInfos[address]) {
      setReplaceRecipient(nextRecipients)
      return setVisible(true)
    }
    setWalletError('')
    setAmountError('')
    setFormInput(DEFAULT_RECIPIENT)
    return dispatch(setRecipient({ walletAddress: address, nextRecipients }))
  }

  const onReplace = () => {
    setVisible(false)
    const { walletAddress } = formInput
    setFormInput(DEFAULT_RECIPIENT)
    setWalletError('')
    setAmountError('')
    return dispatch(
      setRecipient({
        walletAddress,
        nextRecipients: replaceRecipient,
      }),
    )
  }

  const checkIsTyping = useCallback(() => {
    if (formInput.walletAddress || formInput.amount)
      return dispatch(setIsTyping(true))
    return dispatch(setIsTyping(false))
  }, [dispatch, formInput.amount, formInput.walletAddress])

  useEffect(() => {
    checkIsTyping()
  }, [checkIsTyping])

  return (
    <Row
      gutter={[16, 16]}
      align="middle"
      style={{ padding: '12px 16px', background: '#394747' }}
    >
      <Col xs={10} md={14} xl={19}>
        <Input
          value={formInput.walletAddress}
          name="walletAddress"
          placeholder="Wallet address"
          onChange={onChange}
          className="recipient-input"
          autoComplete="off"
        />
      </Col>
      <Col xs={10} md={8} xl={4}>
        <NumericInput
          value={formInput.amount}
          name="amount"
          placeholder="Amount"
          onChange={onAmount}
          autoComplete="off"
          className="recipient-input"
        />
      </Col>
      <Col xs={4} md={2} xl={1}>
        <Button
          type="text"
          size="small"
          style={{ padding: 0, color: '#42E6EB' }}
          onClick={setNewRecipient}
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

export default AddRecipient
