import { Col, Row, Typography } from 'antd'
import Hero from './hero'
import AirdropReceive from './airdropReceive'
import VestingReceive from './vestingReceive'

import './index.less'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'app/model'
import { getDistributors } from 'app/model/distributor.controller'

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getDistributors())
  }, [dispatch])

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
