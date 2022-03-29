import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Col, Divider, Radio, Row, Space, Typography } from 'antd'
import Setting from './setting'
import History from './history'
import IonIcon from 'shared/antd/ionicon'
import PoweredBySentre from 'app/components/poweredBySentre'

import { Step } from 'app/constants'
import { AppState } from 'app/model'

const Header = ({ label }: { label: string }) => {
  const [visible, setVisible] = useState(false)
  const { step } = useSelector((state: AppState) => state.steps)

  const stepOneValue = useMemo(() => {
    if (step === Step.two) return Step.two
    if (step === Step.three) return Step.three
    return Step.one
  }, [step])

  const stepTwoValue = useMemo(() => {
    if (step === Step.three) return Step.three
    return Step.two
  }, [step])

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
        <Space size={16}>
          <PoweredBySentre />
          <Divider
            type="vertical"
            style={{ margin: 0, borderLeft: '1px solid #D3D3D6' }}
          />
          <IonIcon
            style={{ cursor: 'pointer', fontSize: 16 }}
            name="document-text-outline"
            onClick={() => setVisible(true)}
          />
          <Setting />
        </Space>
      </Col>
      <History visible={visible} setVisible={setVisible} />
    </Row>
  )
}

export default Header
