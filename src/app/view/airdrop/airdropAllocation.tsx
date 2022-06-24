import { Card, Col, Row, Typography } from 'antd'
import DoughnutChart from 'app/components/charts/doughnutChart'
import { AirdropAllocationType } from 'app/hooks/airdrop/useAirdropAllocation'

type AirdropAllocationProps = {
  airdropAllocation: Map<string, AirdropAllocationType>
}

const AirdropAllocation = ({ airdropAllocation }: AirdropAllocationProps) => {
  return (
    <Card
      className="card-lightning"
      style={{ height: '100%' }}
      bodyStyle={{ paddingBottom: 0 }}
    >
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>Airdrop allocation</Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <DoughnutChart data={airdropAllocation} />
        </Col>
      </Row>
    </Card>
  )
}

export default AirdropAllocation
