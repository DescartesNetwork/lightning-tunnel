import { Col, Row, Typography } from 'antd'

const Header = () => {
  return (
    <Row gutter={[16, 8]} align="middle" wrap={false} style={{ padding: 8 }}>
      <Col span={2}>
        <Typography.Text type="secondary">No.</Typography.Text>
      </Col>
      <Col span={5}>
        <Typography.Text type="secondary">Wallet address</Typography.Text>
      </Col>
      <Col span={15}>
        <Typography.Text type="secondary">Amount & Unlock time</Typography.Text>
      </Col>
      <Col span={2} />
    </Row>
  )
}

export default Header
