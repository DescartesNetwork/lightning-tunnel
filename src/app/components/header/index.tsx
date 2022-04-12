import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'

import { Col, Radio, Row, Space, Typography } from 'antd'
import SettingButton from './settingButton'
import HistoryButton from './historyButton'

import { Step } from 'app/constants'
import { AppDispatch, AppState } from 'app/model'
import { getHistory } from 'app/model/history.controller'

export type HeaderProps = { label?: string }

const Header = ({ label = '' }: HeaderProps) => {
  const { step } = useSelector((state: AppState) => state.steps)
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walettAddress },
  } = useWallet()

  const stepOneValue = useMemo(() => {
    if (step === Step.two) return Step.two
    if (step === Step.three) return Step.three
    return Step.one
  }, [step])

  const stepTwoValue = useMemo(() => {
    if (step === Step.three) return Step.three
    return Step.two
  }, [step])

  useEffect(() => {
    dispatch(getHistory(walettAddress))
  }, [dispatch, walettAddress])

  return (
    <Row>
      <Col flex="auto">
        <Space direction="vertical" size={12}>
          <Radio.Group value={step} className="steps" buttonStyle="solid">
            <Space>
              <Radio.Button className="rate-btn" value={stepOneValue} />
              <Radio.Button className="rate-btn" value={stepTwoValue} />
              <Radio.Button className="rate-btn" value={Step.three} />
            </Space>
          </Radio.Group>
          <Typography.Title level={5}>{label}</Typography.Title>
        </Space>
      </Col>
      <Col>
        <Space>
          <HistoryButton />
          <SettingButton />
        </Space>
      </Col>
    </Row>
  )
}

export default Header
