import { Card, Col, Empty, Row, Typography } from 'antd'
import DoughnutChart from 'app/components/charts/doughnutChart'
import { AirdropAllocationType } from 'app/constants'
import { Suspense } from 'react'

type AirdropAllocationProps = {
  airdropAllocation: Map<string, AirdropAllocationType>
  loading: boolean
}

const AirdropAllocation = ({
  airdropAllocation,
  loading,
}: AirdropAllocationProps) => {
  return (
    <Suspense fallback={<>...Loading</>}>
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
            {!Object.keys(airdropAllocation).length ? (
              <Empty />
            ) : (
              <DoughnutChart data={airdropAllocation} />
            )}
          </Col>
        </Row>
      </Card>
    </Suspense>
  )
}

export default AirdropAllocation
