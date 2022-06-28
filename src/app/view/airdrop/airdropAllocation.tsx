import { Card, Col, Row, Typography, Spin } from 'antd'
import DoughnutChart from 'app/components/charts/doughnutChart'

import { AllocationType } from 'app/constants'

type AirdropAllocationProps = {
  airdropAllocation: Record<string, AllocationType>
  loading: boolean
}

const AirdropAllocation = ({
  airdropAllocation,
  loading,
}: AirdropAllocationProps) => {
  return (
    <Spin spinning={loading}>
      <Card
        className="card-lightning"
        style={{ height: '100%' }}
        bodyStyle={{ paddingBottom: 0 }}
      >
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Row>
              <Col flex="auto">
                <Typography.Title level={5}>
                  Airdrop allocation
                </Typography.Title>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <DoughnutChart data={airdropAllocation} />
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default AirdropAllocation
