import React from 'react'

import { Col, Row } from 'antd'
import HeroCard from '../dashboard/hero/heroCard'

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
          icon="wallet-outline"
          value={valueInUSD}
          cardStyles={{ padding: '8px 24px' }}
        />
      </Col>
      <Col span={24}>
        <HeroCard
          loading={!numberOfCampaign && loading}
          label="Total campaigns"
          icon="paper-plane-outline"
          value={numberOfCampaign}
          cardStyles={{ padding: '8px 24px' }}
          unit=""
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

export default StatisticVesting
