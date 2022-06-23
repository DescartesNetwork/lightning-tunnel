import { Col, Row } from 'antd'
import HeroCard from '../dashboard/hero/heroCard'

const TotalAirdrop = () => {
  return (
    <Row gutter={[24, 24]} style={{ height: '100%' }}>
      <Col span={24}>
        <HeroCard
          label="Total airdrop"
          icon="wallet-outline"
          value={100}
          cardStyles={{ padding: '8px 24px' }}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          label="Total campaigns"
          icon="paper-plane-outline"
          value={100}
          cardStyles={{ padding: '8px 24px' }}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          label="Total recipients"
          icon="people-outline"
          value={100}
          cardStyles={{ padding: '8px 24px' }}
        />
      </Col>
    </Row>
  )
}

export default TotalAirdrop
