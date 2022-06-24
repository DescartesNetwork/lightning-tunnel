import { Col, Row } from 'antd'
import HeroCard from '../dashboard/hero/heroCard'

type TotalAirdropProps = {
  valueInUSD: number
  numberOfCampaign: number
  recipient?: number
}

const TotalAirdrop = ({
  valueInUSD,
  numberOfCampaign,
  recipient,
}: TotalAirdropProps) => {
  return (
    <Row gutter={[24, 24]} style={{ height: '100%' }}>
      <Col span={24}>
        <HeroCard
          label="Total airdrop"
          icon="wallet-outline"
          value={valueInUSD}
          cardStyles={{ padding: '8px 24px' }}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          label="Total campaigns"
          icon="paper-plane-outline"
          value={numberOfCampaign}
          cardStyles={{ padding: '8px 24px' }}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          label="Total recipients"
          icon="people-outline"
          value={recipient || 0}
          cardStyles={{ padding: '8px 24px' }}
        />
      </Col>
    </Row>
  )
}

export default TotalAirdrop
