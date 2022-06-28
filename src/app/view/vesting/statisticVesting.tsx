import React from 'react'

import { Col, Row } from 'antd'
import HeroCard from '../dashboard/hero/heroCard'

type StatisticVestingProps = {
  valueInUSD: number
  numberOfCampaign: number
  recipientList: number
}

const StatisticVesting = ({
  valueInUSD,
  numberOfCampaign,
  recipientList,
}: StatisticVestingProps) => {
  return (
    <Row gutter={[24, 24]} style={{ height: '100%' }}>
      <Col span={24}>
        <HeroCard
          label="Total vesting"
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
          value={recipientList}
          cardStyles={{ padding: '8px 24px' }}
        />
      </Col>
    </Row>
  )
}

export default StatisticVesting
