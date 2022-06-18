import { Card, Col, Row, Typography } from 'antd'
import DoughnutChart from 'app/components/charts/doughnutChart'

const AirdropAllocation = () => {
  return (
    <Card className="card-lightning" style={{ height: '100%' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>Airdrop allocation</Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <DoughnutChart />
        </Col>
      </Row>
    </Card>
  )
}

export default AirdropAllocation
