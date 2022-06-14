import IonIcon from '@sentre/antd-ionicon'
import { Card, Col, Row, Skeleton, Spin, Typography } from 'antd'
import { numeric } from 'shared/util'

type HeroCardProps = {
  label: string
  icon: string
  value: string | number
  loading?: boolean
}

const HeroCard = ({ label, icon, value, loading = false }: HeroCardProps) => (
  <Spin spinning={loading}>
    <Card bordered={false} className="card-lightning">
      <Row gutter={[12, 12]} align="middle">
        <Col flex="auto">
          <Typography.Text type="secondary">{label}</Typography.Text>
        </Col>
        <Col>
          <IonIcon className="card-hero-icon" name={icon} />
        </Col>
        <Col span={24}>
          <Skeleton />
          <Typography.Title level={5}>
            ${numeric(value).format('0,0.[000]')}
          </Typography.Title>
        </Col>
      </Row>
    </Card>
  </Spin>
)

export default HeroCard
