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
import util from '@senswap/sen-js/dist/utils'

import { Button, Checkbox, Col, Input, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import ModalConfirm from 'app/components/modalConfirm'
import { AppState } from 'app/model'

import useMintDecimals from 'shared/hooks/useMintDecimals'
import { addRecipient, RecipientInfo } from 'app/model/recipients.controller'

const DEFAULT_RECIPIENT = {
  walletAddress: '',
  amount: 0,
  email: '',
}

const ActionButton = ({
  walletAddress,
  disabledBtn,
  addNewRecipient,
}: {
  walletAddress?: string
  disabledBtn: boolean
  addNewRecipient: () => void
}) => {
  return (
    <Fragment>
      {walletAddress ? (
        <Button
          type="text"
          size="small"
          style={{ padding: 0 }}
          // onClick={() => dispatch(deleteRecipient({ walletAddress }))}
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
}: {
  walletAddress?: string
  email?: string
  amount?: number
  index?: number
  isSelect?: boolean
}) => {
  const [formInput, setRecipient] = useState(DEFAULT_RECIPIENT)
  const [visible, setVisible] = useState(false)
  const {
    setting: { decimal },
    main: { mintSelected },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const mintDecimal = useMintDecimals(mintSelected) || 0

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipient({ ...formInput, [e.target.name]: e.target.value })
  }

  const recipientInfo = useCallback(async () => {
    if (account.isAddress(walletAddress) && amount && email) {
      return setRecipient({ walletAddress, email, amount })
    }
    return setRecipient(DEFAULT_RECIPIENT)
  }, [walletAddress, amount, email])

  const addNewRecipient = () => {
    const { walletAddress, email, amount } = formInput
    const recipient: RecipientInfo = [walletAddress, email, amount]
    dispatch(addRecipient({ recipient: recipient }))
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const onMerge = () => {
    // dispatch(mergeRecipient({ recipient: formInput }))
    setVisible(false)
    return setRecipient(DEFAULT_RECIPIENT)
  }

  const disabledBtn = useMemo(() => {
    const { amount, walletAddress, email } = formInput
    if (!amount || !account.isAddress(walletAddress) || !email) return true
    return false
  }, [formInput])

  const disabledInput = walletAddress ? true : false
  const actualAmount = decimal
    ? Number(util.decimalize(formInput.amount, mintDecimal))
    : formInput.amount

  useEffect(() => {
    recipientInfo()
  }, [recipientInfo])

  return (
    <Row gutter={[8, 8]} align="middle" justify="space-between" wrap={false}>
      {isSelect && (
        <Col>
          <Checkbox />
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
        <Input
          disabled={disabledInput}
          value={formInput.amount === 0 ? '' : actualAmount}
          name="amount"
          placeholder="Amount"
          onChange={onChange}
          type="number"
        />
      </Col>
      {!isSelect && (
        <Col>
          <ActionButton
            addNewRecipient={addNewRecipient}
            disabledBtn={disabledBtn}
            walletAddress={walletAddress}
          />
        </Col>
      )}
      <ModalConfirm
        visible={visible}
        closeModal={setVisible}
        title="Do you want to merge a wallet address?"
        description={`There are 2 identical wallet addresses`}
        textButtonConfirm="Merge"
        onConfirm={onMerge}
      />
    </Row>
  )
}

export default InputInfoTransfer
