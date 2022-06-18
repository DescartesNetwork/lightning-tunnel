import { Card, Col, Row, Typography } from 'antd'
import LineChart from 'app/components/charts/lineChart'

const TotalAirdrop = () => {
  return (
    <Card className="card-lightning" style={{ height: '100%' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>Total airdrop</Typography.Title>
            </Col>
            <Col>
              <Typography.Title level={3}>$989</Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <LineChart />
        </Col>
      </Row>
    </Card>
  )
}

export default TotalAirdrop
