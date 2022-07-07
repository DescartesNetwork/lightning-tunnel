import { Card, Col, Empty, Row, Spin, Typography } from 'antd'
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
    <Spin spinning={loading}>
      <Card
        className="card-lightning"
        style={{ height: '100%' }}
        bodyStyle={{ paddingBottom: 0 }}
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
    </Spin>
  )
}

export default VestingAllocation
