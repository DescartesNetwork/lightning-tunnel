import { Button, Col, Row, Typography } from 'antd'
import Hero from './hero'
import AirdropReceive from './airdropReceive'
import VestingReceive from './vestingReceive'

import './index.less'
import { useMigrate } from 'hooks/useMigrate'

const Dashboard = () => {
  const { loading, onBackup } = useMigrate()
  return (
    <Row gutter={[0, 24]}>
      <Button size="large" loading={loading} onClick={onBackup} type="primary">
        Backup Data
      </Button>
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
