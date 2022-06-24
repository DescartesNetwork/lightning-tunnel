import { Col, Row, Typography } from 'antd'
import Container from './container'

import './index.less'

const AddNewAirdrop = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={2}>Add new Airdrop</Typography.Title>
      </Col>
      <Col span={24}>
        <Container />
      </Col>
    </Row>
  )
}

export default AddNewAirdrop
