import { Col, Divider, Row, Space, Typography } from 'antd'
import Setting from './setting'

import PoweredBySentre from 'app/components/poweredBySentre'

const Header = ({ label }: { label: string }) => {
  return (
    <Row>
      <Col flex="auto">
        <Typography.Title level={5}>{label}</Typography.Title>
      </Col>
      <Col>
        <Space size={16}>
          <PoweredBySentre />
          <Divider
            type="vertical"
            style={{ margin: 0, borderLeft: '1px solid #D3D3D6' }}
          />
          <Setting />
        </Space>
      </Col>
    </Row>
  )
}

export default Header
