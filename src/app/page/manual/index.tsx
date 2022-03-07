import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row } from 'antd'
import Header from './header'
import InputInfoTransfer from '../../components/inputInfoTransfer'
import CardTotal from 'app/components/cardTotal'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { onSelectMethod } from 'app/model/main.controller'
import { Step } from 'app/constants'
import { removeRecipients } from 'app/model/recipients.controller'

const Manual = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    recipients: { recipients },
  } = useSelector((state: AppState) => state)

  const listRecipients = useMemo(
    () => Object.values(recipients).map((recipient) => recipient),
    [recipients],
  )
  const onBack = useCallback(async () => {
    await dispatch(onSelectMethod(undefined))
    dispatch(removeRecipients())
    dispatch(onSelectStep(Step.zero))
  }, [dispatch])

  return (
    <Card className="card-priFi" bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Header />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                {listRecipients &&
                  listRecipients.map(({ walletAddress }) => (
                    <Col span={24} key={walletAddress}>
                      <InputInfoTransfer walletAddress={walletAddress} />
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
              <Button size="large" type="ghost" onClick={onBack} block>
                Back
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                type="primary"
                onClick={() => dispatch(onSelectStep(Step.two))}
                block
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
