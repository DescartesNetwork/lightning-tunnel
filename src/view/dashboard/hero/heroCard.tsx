import { CSSProperties, ReactNode } from 'react'
import { util } from '@sentre/senhub'

import { Card, Col, Row, Space, Typography } from 'antd'

import './heroCard.less'

type HeroCardProps = {
  label: string
  icon: ReactNode
  value: string | number
  unit?: string
  loading?: boolean
  cardStyles?: CSSProperties
}

const HeroCard = ({
  label,
  icon,
  value,
  unit = '$',
  loading = false,
  cardStyles = {},
}: HeroCardProps) => (
  <Card
    bordered={false}
    className="card-lightning"
    bodyStyle={cardStyles}
    loading={loading}
    style={{ height: '100%' }}
  >
    <Row align="middle">
      <Col flex="auto">
        <Space direction="vertical">
          <Typography.Text type="secondary">{label}</Typography.Text>
          <Typography.Title level={4}>
            {unit}
            {util.numeric(value).format('0,0.[000]')}
          </Typography.Title>
        </Space>
      </Col>
      <Col>{icon}</Col>
    </Row>
  </Card>
)

export default HeroCard
