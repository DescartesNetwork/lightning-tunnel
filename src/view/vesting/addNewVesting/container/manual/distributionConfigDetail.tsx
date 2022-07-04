import moment from 'moment'

import { Col, Row, Space, Typography } from 'antd'

import { Configs } from 'model/recipients.controller'

const Content = ({ label, value }: { label: string; value: string }) => (
  <Space size={4}>
    <Typography.Text className="caption" type="secondary">
      {label}
    </Typography.Text>
    <Typography.Text>{value}</Typography.Text>
  </Space>
)

type DistributionConfigDetailProps = {
  configs: Configs
  unlockTime: number
}

const DistributionConfigDetail = ({
  configs,
  unlockTime,
}: DistributionConfigDetailProps) => {
  return (
    <Row gutter={[32, 32]} align="middle">
      <Col>
        <Content
          label="Unlock time:"
          value={moment(unlockTime).format('DD-MM-YYYY HH:mm')}
        />
      </Col>
      <Col>
        <Content
          label="Distribution frequency:"
          value={`${configs.frequency} days`}
        />
      </Col>
      <Col>
        <Content
          label="Distribute in:"
          value={`${configs.distributeIn} months`}
        />
      </Col>
    </Row>
  )
}

export default DistributionConfigDetail
