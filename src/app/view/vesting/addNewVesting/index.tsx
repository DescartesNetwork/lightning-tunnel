import { Col, Row, Typography } from 'antd'
import Container from './container'

import './index.less'

const AddNewVesting = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={2}>Add new Vesting</Typography.Title>
      </Col>
      <Col>
        <Container />
      </Col>
    </Row>
  )
}

export default AddNewVesting
