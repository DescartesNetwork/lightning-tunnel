import { Col, Row } from 'antd'
// import useTotalUSD from 'app/hooks/useBalance'
import HeroCard from './heroCard'

const Hero = () => {
  // const { totalUSD, loading } = useTotalUSD()
  return (
    <Row gutter={[24, 24]}>
      <Col lg={8} md={12} xs={24}>
        <HeroCard label="Total balance" icon="wallet-outline" value={200} />
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
