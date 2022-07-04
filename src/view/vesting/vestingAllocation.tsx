import { Card, Col, Row, Spin, Typography } from 'antd'
import DoughnutChart from 'components/charts/doughnutChart'
import CustomizedLegend from 'components/charts/doughnutChart/customizedLegend'

import { AllocationType } from '../../constants'

type VestingAllocationProps = {
  vestingAllocation: Record<string, AllocationType>
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
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <Row>
              <Col flex="auto">
                <Typography.Title level={5}>
                  Vesting allocation
                </Typography.Title>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row>
              <Col xs={14} sm={10}>
                <DoughnutChart data={vestingAllocation} />
              </Col>
              <Col xs={10} sm={14}>
                <CustomizedLegend data={vestingAllocation} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default VestingAllocation
