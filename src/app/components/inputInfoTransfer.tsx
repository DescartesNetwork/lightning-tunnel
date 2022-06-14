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
  addRecipients,
  RecipientInfo,
  RecipientInfos,
  removeRecipient,
} from 'app/model/recipients.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { onSelectedFile } from 'app/model/file.controller'
import { setIsTyping } from 'app/model/main.controller'

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
    main: { mintSelected },
    recipients: { recipients },
    setting: { decimal },
    file: { selectedFile },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipient({ ...formInput, [e.target.name]: e.target.value })
  }

  const onAmount = (val: string) => setRecipient({ ...formInput, amount: val })

  const onSelected = (checked: boolean, index?: number) =>
    dispatch(onSelectedFile({ checked, index }))

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

    for (const [address] of recipients) {
      if (walletAddress === address) return setVisible(true)
    }

    const recipient: RecipientInfo = [walletAddress, amount]
    setWalletError('')
    setAmountError('')
    await dispatch(addRecipient({ recipient }))
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const onMerge = async () => {
    const { walletAddress, amount } = formInput
    const recipient = recipients.find(([address]) => address === walletAddress)
    if (!recipient || !mintDecimals) return

    const newAmount =
      utils.decimalize(recipient[1], mintDecimals) +
      utils.decimalize(amount, mintDecimals)

    const nextRecipient: RecipientInfo = [
      walletAddress,
      utils.undecimalize(newAmount, mintDecimals),
    ]

    await dispatch(removeRecipient({ recipient }))
    await dispatch(addRecipient({ recipient: nextRecipient }))
    await setVisible(false)
    if (amountError || walletError) {
      setAmountError('')
      setWalletError('')
    }
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const remove = () => {
    if (index === undefined) return
    const nextData: RecipientInfos = [...recipients]
    nextData.splice(index, 1)
    return dispatch(addRecipients({ recipients: nextData }))
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
            checked={selectedFile?.includes(index as number)}
            onChange={(e) => onSelected(e.target.checked, index)}
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
            remove={remove}
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
