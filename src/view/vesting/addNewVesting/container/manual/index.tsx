import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row } from 'antd'
import Header from '../../../../../components/header'
import CardTotal from 'components/cardTotal'
import CommonModal from 'components/commonModal'
import AddRecipient from '../../components/addRecipient'
import DisplayRecipient from '../../components/displayRecipient'

import { AppDispatch, AppState } from 'model'
import { onSelectStep } from 'model/steps.controller'
import { Method, Step } from '../../../../../constants'
import useTotal from 'hooks/useTotal'
import useValidateAmount from 'hooks/useValidateAmount'
import useRemainingBalance from 'hooks/useRemainingBalance'
import {
  removeRecipients,
  setExpiration,
  setGlobalUnlockTime,
} from 'model/recipients.controller'
import { onSelectMethod } from 'model/main.controller'

const Manual = () => {
  const [visible, setVisible] = useState(false)
  const {
    main: { mintSelected, isTyping },
  } = useSelector((state: AppState) => state)
  const { quantity } = useTotal()
  const remainingBalance = useRemainingBalance(mintSelected)
  const { amountError } = useValidateAmount()
  const dispatch = useDispatch<AppDispatch>()

  const onBack = useCallback(async () => {
    await dispatch(removeRecipients())
    await dispatch(setGlobalUnlockTime(0))
    await dispatch(setExpiration(0))
    await dispatch(onSelectStep(Step.SelectMethod))
    await dispatch(onSelectMethod(Method.manual))
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
              <AddRecipient />
            </Col>
            <DisplayRecipient />
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
