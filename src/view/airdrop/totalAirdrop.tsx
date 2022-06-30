import { Col, Row } from 'antd'
import HeroCard from '../dashboard/hero/heroCard'

type TotalAirdropProps = {
  valueInUSD: number
  numberOfCampaign: number
  recipientList: number
  loading: boolean
}

const TotalAirdrop = ({
  valueInUSD,
  numberOfCampaign,
  recipientList,
  loading,
}: TotalAirdropProps) => {
  return (
    <Row gutter={[24, 24]} style={{ height: '100%' }}>
      <Col span={24}>
        <HeroCard
          label="Total airdrop"
          icon="wallet-outline"
          value={valueInUSD}
          cardStyles={{ padding: '8px 24px' }}
          loading={!valueInUSD && loading}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          label="Total campaigns"
          icon="paper-plane-outline"
          value={numberOfCampaign}
          cardStyles={{ padding: '8px 24px' }}
          unit=""
          loading={!numberOfCampaign && loading}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          loading={!recipientList && loading}
          label="Total recipients"
          icon="people-outline"
          value={recipientList}
          cardStyles={{ padding: '8px 24px' }}
          unit=""
        />
      </Col>
    </Row>
  )
}

export default TotalAirdrop
