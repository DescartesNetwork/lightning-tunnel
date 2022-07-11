import { Card, Col, Empty, Row, Typography } from 'antd'
import DoughnutChart from 'components/charts/doughnutChart'
import CustomizedLegend from 'components/charts/doughnutChart/customizedLegend'

import { Allocation } from '../../constants'

type VestingAllocationProps = {
  vestingAllocation: Record<string, Allocation>
  loading: boolean
}

const VestingAllocation = ({
  vestingAllocation,
  loading,
}: VestingAllocationProps) => {
  return (
    <Card
      className="card-lightning"
      bodyStyle={{ paddingBottom: 0 }}
      style={{ height: '100%' }}
      loading={loading}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Vesting allocation</Typography.Title>
        </Col>
        <Col span={24}>
          {!Object.keys(vestingAllocation).length ? (
            <Empty />
          ) : (
            <Row gutter={[8, 8]} align="middle">
              <Col xs={14} sm={10}>
                <DoughnutChart data={vestingAllocation} />
              </Col>
              <Col xs={10} sm={14}>
                <CustomizedLegend data={vestingAllocation} />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Card>
  )
}

export default VestingAllocation
