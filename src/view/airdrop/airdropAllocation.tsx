import { Card, Col, Row, Typography, Spin } from 'antd'
import DoughnutChart from 'components/charts/doughnutChart'
import CustomizedLegend from 'components/charts/doughnutChart/customizedLegend'

import { AllocationType } from '../../constants'

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
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <Typography.Title level={5}>Airdrop allocation</Typography.Title>
          </Col>
          <Col span={24}>
            <Row>
              <Col xs={14} sm={10}>
                <DoughnutChart data={airdropAllocation} />
              </Col>
              <Col xs={10} sm={14}>
                <CustomizedLegend data={airdropAllocation} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default AirdropAllocation
