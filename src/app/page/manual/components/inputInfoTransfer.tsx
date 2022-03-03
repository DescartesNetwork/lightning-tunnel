import { Col, Input, Row, Typography } from 'antd'

const InputInfoTransfer = () => {
  return (
    <Row gutter={[8, 8]} align="middle">
      <Col span={8}>
        <Input placeholder="Wallet address" />
      </Col>
      <Col span={8}>
        <Input placeholder="Email" />
      </Col>
      <Col span={6}>
        <Input placeholder="Amount" />
      </Col>
      <Col span={2} style={{ textAlign: 'center' }}>
        <Typography.Text style={{ color: '#F9575E', fontWeight: '700' }}>
          OK
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default InputInfoTransfer
