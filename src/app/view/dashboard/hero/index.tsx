import { Col, Row, Spin } from 'antd'
import HeroCard from './heroCard'

import useTotalUSD from 'app/hooks/useTotalUSD'

const Hero = () => {
  const { totalUSD, loading } = useTotalUSD()

  return (
    <Row gutter={[24, 24]}>
      <Col lg={8} md={12} xs={24}>
        <Spin spinning={loading}>
          <HeroCard
            label="Total balance"
            icon="wallet-outline"
            value={totalUSD}
          />
        </Spin>
      </Col>
      <Col lg={8} md={12} xs={24}>
        <HeroCard
          label="Total distribution"
          icon="log-out-outline"
          value={100}
        />
      </Col>
      <Col lg={8} md={12} xs={24}>
        <HeroCard label="Total received" icon="log-in-outline" value={200} />
      </Col>
    </Row>
  )
}

export default Hero
