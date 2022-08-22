import { Col, Row, Typography } from 'antd'
import AirdropForm from './airdropForm'

import './index.less'

const AddNewAirdrop = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={2}>Add new Airdrop</Typography.Title>
      </Col>
      <Col span={24}>
        <AirdropForm />
      </Col>
    </Row>
  )
}

export default AddNewAirdrop
