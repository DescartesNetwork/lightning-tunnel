import { Col, Row, Typography } from 'antd'
import Hero from './hero'
import AirdropReceive from './airdropReceive'
import VestingReceive from './vestingReceive'

import './index.less'

const Dashboard = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={2}>Dashboard</Typography.Title>
      </Col>
      <Col span={24}>
        <Hero />
      </Col>
      <Col span={24}>
        <AirdropReceive />
      </Col>
      <Col span={24}>
        <VestingReceive />
      </Col>
    </Row>
  )
}
export default Dashboard
