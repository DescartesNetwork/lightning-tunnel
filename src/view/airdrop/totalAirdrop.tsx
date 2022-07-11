import IonIcon from '@sentre/antd-ionicon'
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
          icon={
            <IonIcon className="card-hero-icon" name="cloud-download-outline" />
          }
          value={valueInUSD}
          loading={!valueInUSD && loading}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          label="Total campaigns"
          icon={
            <IonIcon className="card-hero-icon" name="paper-plane-outline" />
          }
          value={numberOfCampaign}
          unit=""
          loading={!numberOfCampaign && loading}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          loading={!recipientList && loading}
          label="Total recipients"
          icon={<IonIcon className="card-hero-icon" name="people-outline" />}
          value={recipientList}
          unit=""
        />
      </Col>
    </Row>
  )
}

export default TotalAirdrop
