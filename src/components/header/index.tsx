import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Col, Radio, Row, Space, Typography } from 'antd'
import SettingButton from './settingButton'

import { Step } from '../../constants'
import { AppState } from 'model'

export type HeaderProps = { label?: string }

const Header = ({ label = '' }: HeaderProps) => {
  const { step } = useSelector((state: AppState) => state.steps)

  const stepOneValue = useMemo(() => {
    if (step === Step.AddRecipient) return Step.AddRecipient
    if (step === Step.ConfirmTransfer) return Step.ConfirmTransfer
    return Step.SelectMethod
  }, [step])

  const stepTwoValue = useMemo(() => {
    if (step === Step.ConfirmTransfer) return Step.ConfirmTransfer
    return Step.AddRecipient
  }, [step])

  return (
    <Row>
      <Col flex="auto">
        <Space direction="vertical" size={12}>
          <Radio.Group value={step} className="steps" buttonStyle="solid">
            <Space>
              <Radio.Button className="rate-btn" value={stepOneValue} />
              <Radio.Button className="rate-btn" value={stepTwoValue} />
              <Radio.Button className="rate-btn" value={Step.ConfirmTransfer} />
            </Space>
          </Radio.Group>
          <Typography.Title level={5}>{label}</Typography.Title>
        </Space>
      </Col>
      <Col>
        <SettingButton />
      </Col>
    </Row>
  )
}

export default Header
