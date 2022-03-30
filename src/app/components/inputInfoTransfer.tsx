import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'

import { Button, Checkbox, Col, Input, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import {
  addRecipient,
  addRecipients,
  RecipientInfo,
  RecipientInfos,
  removeRecipient,
} from 'app/model/recipients.controller'
import { onSelectedFile } from 'app/model/main.controller'
import NumericInput from 'shared/antd/numericInput'
import ModalMerge from './modalMerge'
import useMintDecimals from 'shared/hooks/useMintDecimals'

type InputInfoTransferProps = {
  walletAddress?: string
  amount?: bigint
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
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  const {
    main: { selectedFile, mintSelected },
    setting: { decimal },
    recipients: { recipients },
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
      return setRecipient({
        walletAddress,
        amount: utils.undecimalize(amount, mintDecimals),
      })
    }
    return setRecipient(DEFAULT_RECIPIENT)
  }, [walletAddress, amount, mintDecimals])

  const addNewRecipient = async () => {
    const { walletAddress, amount } = formInput

    if (!account.isAddress(walletAddress))
      return setError('Wrong wallet address')

    for (const [address] of recipients) {
      if (walletAddress === address) return setVisible(true)
    }
    const actualAmount = decimal ? Number(amount) * 10 ** mintDecimals : amount

    const recipient: RecipientInfo = [walletAddress, BigInt(actualAmount)]
    setError('')
    await dispatch(addRecipient({ recipient }))
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const onMerge = async () => {
    const { walletAddress, amount } = formInput
    const recipient = recipients.find(([address]) => address === walletAddress)
    if (!recipient) return

    const nextAmount = decimal ? Number(amount) * 10 ** mintDecimals : amount
    const newAmount = recipient[1] + BigInt(nextAmount)

    const nextRecipient: RecipientInfo = [walletAddress, newAmount]

    await dispatch(removeRecipient({ recipient }))
    await dispatch(addRecipient({ recipient: nextRecipient }))
    await setVisible(false)
    if (error) setError('')
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const remove = () => {
    if (index === undefined) return
    const nextData: RecipientInfos = [...recipients]
    nextData.splice(index, 1)
    return dispatch(addRecipients({ recipients: nextData }))
  }

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
      <Col span={16}>
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
      <Col span={6}>
        <NumericInput
          disabled={disabledInput}
          value={
            amount ? utils.undecimalize(amount, mintDecimals) : formInput.amount
          }
          name="amount"
          placeholder="Amount"
          onValue={onAmount}
          className="recipient-input"
          autoComplete="off"
        />
      </Col>
      {!isSelect && (
        <Col>
          <ActionButton
            addNewRecipient={addNewRecipient}
            walletAddress={walletAddress}
            remove={remove}
          />
        </Col>
      )}
      {error && (
        <Col span={24}>
          <Space>
            <IonIcon style={{ color: '#f2323f' }} name="warning-outline" />
            <Typography.Text type="danger">{error}</Typography.Text>
          </Space>
        </Col>
      )}
      <ModalMerge
        onConfirm={onMerge}
        visible={visible}
        setVisible={setVisible}
        onCancel={() => setVisible(false)}
      />
    </Row>
  )
}

export default InputInfoTransfer
