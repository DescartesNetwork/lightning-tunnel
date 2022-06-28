import React from 'react'

import { Card, Col, Row, Typography } from 'antd'
import DoughnutChart from 'app/components/charts/doughnutChart'
import { AllocationType } from 'app/constants'

type VestingAllocationProps = {
  vestingAllocation: Record<string, AllocationType>
  loading: boolean
}

const VestingAllocation = ({
  vestingAllocation,
  loading,
}: VestingAllocationProps) => {
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
              <Typography.Title level={5}>Vesting allocation</Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <DoughnutChart data={vestingAllocation} />
        </Col>
      </Row>
    </Card>
  )
}

export default VestingAllocation
