import { CSSProperties } from 'react'
import { util } from '@sentre/senhub'

import IonIcon from '@sentre/antd-ionicon'
import { Card, Col, Row, Spin, Typography } from 'antd'

type HeroCardProps = {
  label: string
  icon: string
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
  <Spin spinning={loading}>
    <Card
      bordered={false}
      className="card-lightning"
      bodyStyle={cardStyles}
      style={{ height: '100%' }}
    >
      <Row gutter={[12, 12]} align="middle">
        <Col flex="auto">
          <Typography.Text type="secondary">{label}</Typography.Text>
        </Col>
        <Col>
          <IonIcon className="card-hero-icon" name={icon} />
        </Col>
        <Col span={24}>
          <Typography.Title level={5}>
            {unit}
            {util.numeric(value).format('0,0.[000]')}
          </Typography.Title>
        </Col>
      </Row>
    </Card>
  </Spin>
)

export default HeroCard
