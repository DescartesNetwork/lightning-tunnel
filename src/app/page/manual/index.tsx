import { Button, Card, Col, Row } from 'antd'
import Header from './header'
import InputInfoTransfer from './components/inputInfoTransfer'
import CardTotal from './components/cardTotal'

const Manual = () => {
  return (
    <Card className="card-priFi" bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Header />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <InputInfoTransfer />
            </Col>
            <Col span={24}>
              <CardTotal />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Button size="large" type="ghost" block>
                Back
              </Button>
            </Col>
            <Col span={12}>
              <Button size="large" block type="primary">
                Continue
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default Manual
