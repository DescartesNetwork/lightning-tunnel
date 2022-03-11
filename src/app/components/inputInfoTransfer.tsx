import {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Button, Checkbox, Col, Input, Row, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import {
  addRecipient,
  addRecipients,
  RecipientInfo,
  RecipientInfos,
} from 'app/model/recipients.controller'
import { onSelectedFile } from 'app/model/main.controller'
import NumericInput from 'shared/antd/numericInput'

type InputInfoTransferProps = {
  walletAddress?: string
  email?: string
  amount?: string
  index?: number
  isSelect?: boolean
}

const DEFAULT_RECIPIENT = {
  walletAddress: '',
  amount: '',
  email: '',
}

const ActionButton = ({
  walletAddress,
  disabledBtn,
  addNewRecipient,
  remove,
}: {
  walletAddress?: string
  disabledBtn: boolean
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
          style={{ padding: 0 }}
          onClick={addNewRecipient}
          disabled={disabledBtn}
          danger
        >
          OK
        </Button>
      )}
    </Fragment>
  )
}

const InputInfoTransfer = ({
  walletAddress,
  email,
  amount,
  index,
  isSelect = false,
}: InputInfoTransferProps) => {
  const [formInput, setRecipient] = useState(DEFAULT_RECIPIENT)
  const [error, setError] = useState(false)
  const {
    main: { selectedFile },
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipient({ ...formInput, [e.target.name]: e.target.value })
  }

  const onAmount = (val: string) => setRecipient({ ...formInput, amount: val })

  const onSelected = (checked: boolean, index?: number) =>
    dispatch(onSelectedFile({ checked, index }))

  const recipientInfo = useCallback(async () => {
    if (account.isAddress(walletAddress) && amount && email) {
      return setRecipient({ walletAddress, email, amount })
    }
    return setRecipient(DEFAULT_RECIPIENT)
  }, [walletAddress, amount, email])

  const addNewRecipient = async () => {
    const { walletAddress, email, amount } = formInput
    if (Number(amount) % 1 !== 0) return setError(true)

    const recipient: RecipientInfo = [walletAddress, email, amount]
    setError(false)
    await dispatch(addRecipient({ recipient }))
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const remove = () => {
    if (index === undefined) return
    const nextData: RecipientInfos = [...recipients]
    nextData.splice(index, 1)
    return dispatch(addRecipients({ recipients: nextData }))
  }
  const disabledBtn = useMemo(() => {
    const { amount, walletAddress, email } = formInput
    if (!amount || !account.isAddress(walletAddress) || !email) return true
    return false
  }, [formInput])

  const disabledInput = walletAddress ? true : false

  useEffect(() => {
    recipientInfo()
  }, [recipientInfo])

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
      <Col span={8}>
        <Input
          disabled={disabledInput}
          value={formInput.walletAddress}
          name="walletAddress"
          placeholder="Wallet address"
          onChange={onChange}
        />
      </Col>
      <Col span={8}>
        <Input
          disabled={disabledInput}
          onChange={onChange}
          value={formInput.email}
          name="email"
          placeholder="Email"
        />
      </Col>
      <Col span={6}>
        <NumericInput
          disabled={disabledInput}
          value={amount ? amount : formInput.amount}
          name="amount"
          placeholder="Amount"
          onValue={onAmount}
        />
      </Col>
      {!isSelect && (
        <Col>
          <ActionButton
            addNewRecipient={addNewRecipient}
            disabledBtn={disabledBtn}
            walletAddress={walletAddress}
            remove={remove}
          />
        </Col>
      )}
      {error && (
        <Col span={24}>
          <Typography.Text type="danger">
            Should be natural numbers
          </Typography.Text>
        </Col>
      )}
    </Row>
  )
}

export default InputInfoTransfer
