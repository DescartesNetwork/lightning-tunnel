import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row } from 'antd'
import Header from '../../../../../components/header'
import InputInfoTransfer from '../../../../../components/inputInfoTransfer'
import CardTotal from 'components/cardTotal'
import CommonModal from 'components/commonModal'

import { AppDispatch, AppState } from 'model'
import { onSelectStep } from 'model/steps.controller'
import { SelectMethod, Step } from '../../../../../constants'
import useTotal from 'hooks/useTotal'
import useValidateAmount from 'hooks/useValidateAmount'
import useRemainingBalance from 'hooks/useRemainingBalance'
import { RecipientInfo, removeRecipients } from 'model/recipients.controller'
import { onSelectMethod } from 'model/main.controller'

const Manual = () => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    recipients: { recipientInfos },
    main: { mintSelected, isTyping },
  } = useSelector((state: AppState) => state)
  const { quantity } = useTotal()
  const remainingBalance = useRemainingBalance(mintSelected)

  const listRecipient = useMemo(() => {
    const nextRecipient: RecipientInfo[] = []
    for (const address in recipientInfos) {
      nextRecipient.push(recipientInfos[address][0])
    }
    return nextRecipient
  }, [recipientInfos])

  const { amountError } = useValidateAmount()

  const onBack = useCallback(async () => {
    await dispatch(onSelectStep(Step.SelectMethod))
    await dispatch(onSelectMethod(SelectMethod.manual))
    await dispatch(removeRecipients())
  }, [dispatch])

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
            <Col span={24}>
              <Row gutter={[8, 8]}>
                {listRecipient &&
                  listRecipient.map(({ address, amount }, index) => (
                    <Col span={24} key={address + index}>
                      <InputInfoTransfer
                        amount={amount}
                        walletAddress={address}
                        index={index}
                      />
                    </Col>
                  ))}
                <Col span={24}>
                  <InputInfoTransfer />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <CardTotal />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Button
                onClick={() => setVisible(true)}
                size="large"
                type="ghost"
                block
              >
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
      <CommonModal
        visible={visible}
        setVisible={setVisible}
        onCancel={() => setVisible(false)}
        title="Are you sure you want to go back?"
        description="Your data will not be saved."
        btnText="go back"
        onConfirm={onBack}
      />
    </Card>
  )
}

export default Manual
