import React from 'react'

import { Col, Row } from 'antd'
import HeroCard from '../dashboard/hero/heroCard'
import IonIcon from '@sentre/antd-ionicon'

type StatisticVestingProps = {
  valueInUSD: number
  numberOfCampaign: number
  recipientList: number
  loading: boolean
}

const StatisticVesting = ({
  valueInUSD,
  numberOfCampaign,
  recipientList,
  loading,
}: StatisticVestingProps) => {
  return (
    <Row gutter={[24, 24]} style={{ height: '100%' }}>
      <Col span={24}>
        <HeroCard
          loading={!valueInUSD && loading}
          label="Total vesting"
          icon={<IonIcon className="card-hero-icon" name="receipt-outline" />}
          value={valueInUSD}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          loading={!numberOfCampaign && loading}
          label="Total campaigns"
          icon={
            <IonIcon className="card-hero-icon" name="paper-plane-outline" />
          }
          value={numberOfCampaign}
          unit=""
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

export default StatisticVesting
