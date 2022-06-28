import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row } from 'antd'
import Header from '../../../../../components/header'
import CardTotal from 'app/components/cardTotal'
import MethodInputRecipient from './methodInputRecipient'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'
import useTotal from 'app/hooks/useTotal'
import useValidateAmount from 'app/hooks/useValidateAmount'
import useRemainingBalance from 'app/hooks/useRemainingBalance'
import {
  RecipientInfo,
  removeRecipients,
  setGlobalUnlockTime,
} from 'app/model/recipients.controller'
import {
  setAdvancedMode,
  setListUnlockTime,
} from 'app/model/advancedMode.controller'

const Manual = () => {
  const {
    recipients: { recipientInfos },
    main: { mintSelected, isTyping },
  } = useSelector((state: AppState) => state)
  const { quantity } = useTotal()
  const remainingBalance = useRemainingBalance(mintSelected)
  const dispatch = useDispatch<AppDispatch>()

  const listRecipient = useMemo(() => {
    const nextRecipient: RecipientInfo[] = []
    for (const address in recipientInfos) {
      const amountRecipient = recipientInfos[address].length
      const amount = Number(recipientInfos[address][0].amount) * amountRecipient

      const recipient: RecipientInfo = {
        address,
        amount: amount.toString(),
        unlockTime: 0,
      }
      nextRecipient.push(recipient)
    }
    return nextRecipient
  }, [recipientInfos])

  const onBack = useCallback(async () => {
    await dispatch(removeRecipients())
    await dispatch(setAdvancedMode(false))
    await dispatch(setListUnlockTime([]))
    await dispatch(setGlobalUnlockTime(0))

    dispatch(onSelectStep(Step.SelectMethod))
  }, [dispatch])

  const { amountError } = useValidateAmount(listRecipient)

  const disabled =
    quantity <= 0 || amountError || remainingBalance < 0 || isTyping

  return (
    <Card className="card-lightning" bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Header label="Fill in recipient information" />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>Wallet address #{listRecipient.length + 1}</Col>
            <Col span={24}>
              <MethodInputRecipient />
            </Col>
            {listRecipient &&
              listRecipient.map(({ address, amount }, index) => (
                <Col span={24} key={address + index}>
                  <MethodInputRecipient
                    walletAddress={address}
                    amount={amount}
                    index={index}
                  />
                </Col>
              ))}
            <Col span={24}>
              <CardTotal />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Button onClick={onBack} size="large" type="ghost" block>
                Back
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                type="primary"
                onClick={() => dispatch(onSelectStep(Step.ConfirmTransfer))}
                block
                disabled={disabled}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default Manual
