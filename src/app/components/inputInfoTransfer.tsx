import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Button, Col, Input, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import ModalConfirm from 'app/components/modalConfirm'
import { AppState } from 'app/model'
import {
  addRecipient,
  deleteRecipient,
  mergeRecipient,
  RecipientInfo,
} from 'app/model/recipients.controller'

const DEFAULT_RECIPIENT: RecipientInfo = {
  walletAddress: '',
  amount: 0,
  email: '',
}

const InputInfoTransfer = ({ walletAddress }: { walletAddress?: string }) => {
  const [recipient, setRecipient] = useState<RecipientInfo>(DEFAULT_RECIPIENT)
  const [visible, setVisible] = useState(false)
  const [existedWallet, setExistedWallet] = useState('')
  const { recipients } = useSelector((state: AppState) => state.recipients)
  const dispatch = useDispatch()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipient({ ...recipient, [e.target.name]: e.target.value })
  }

  const recipientInfo = useCallback(() => {
    if (account.isAddress(walletAddress))
      return setRecipient(recipients[walletAddress])
    return setRecipient(DEFAULT_RECIPIENT)
  }, [walletAddress, recipients])

  const addNewRecipient = () => {
    const { walletAddress } = recipient
    if (recipients[walletAddress]) {
      setVisible(true)
      return setExistedWallet(walletAddress)
    }
    dispatch(addRecipient({ recipient }))
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const onMerge = () => {
    dispatch(mergeRecipient({ recipient }))
    setVisible(false)
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const disabledBtn = useMemo(() => {
    const { amount, walletAddress, email } = recipient
    if (!amount || !account.isAddress(walletAddress) || !email) return true
    return false
  }, [recipient])

  const disabledInput = walletAddress ? true : false

  useEffect(() => {
    recipientInfo()
  }, [recipientInfo])

  return (
    <Row gutter={[8, 8]} align="middle">
      <Col span={8}>
        <Input
          disabled={disabledInput}
          value={recipient.walletAddress}
          name="walletAddress"
          placeholder="Wallet address"
          onChange={onChange}
        />
      </Col>
      <Col span={8}>
        <Input
          disabled={disabledInput}
          onChange={onChange}
          value={recipient.email}
          name="email"
          placeholder="Email"
        />
      </Col>
      <Col span={6}>
        <Input
          disabled={disabledInput}
          value={recipient.amount === 0 ? '' : recipient.amount}
          name="amount"
          placeholder="Amount"
          onChange={onChange}
          type="number"
        />
      </Col>
      <Col span={2} style={{ textAlign: 'center' }}>
        {walletAddress ? (
          <Button
            type="text"
            onClick={() => dispatch(deleteRecipient({ walletAddress }))}
          >
            <span>
              <IonIcon style={{ fonSize: 20 }} name="trash-outline" />
            </span>
          </Button>
        ) : (
          <Button
            onClick={addNewRecipient}
            disabled={disabledBtn}
            danger
            type="text"
          >
            OK
          </Button>
        )}
      </Col>
      <ModalConfirm
        visible={visible}
        closeModal={setVisible}
        title="Do you want to merge a wallet address?"
        description={`There are 2 identical wallet addresses: ${existedWallet}`}
        textButtonConfirm="Merge"
        onConfirm={onMerge}
      />
    </Row>
  )
}

export default InputInfoTransfer
