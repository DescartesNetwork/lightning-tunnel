import { useSelector } from 'react-redux'

import { Col, Progress, Row, Space, Typography } from 'antd'
import SettingButton from './settingButton'

import { AppState } from 'model'

import './index.less'

export type HeaderProps = { label?: string }

const PERCENT: Record<number, number> = {
  1: 25,
  2: 50,
  3: 100,
}

const Header = ({ label = '' }: HeaderProps) => {
  const { step } = useSelector((state: AppState) => state.steps)

  return (
    <Row>
      <Col flex="auto">
        <Space direction="vertical" size={12}>
          <Progress
            className="progress"
            percent={PERCENT[step]}
            steps={3}
            showInfo={false}
          />
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
