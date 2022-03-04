import { Col, Row } from 'antd'
import StepPriFi from 'app/components/stepPriFi'
import Container from './container'

const Page = () => {
  return (
    <Row gutter={[24, 24]} justify="center">
      <Col span={5}>
        <StepPriFi />
      </Col>
      <Col span={10}>
        <Container />
      </Col>
      <Col span={5} /> {/** safe place */}
    </Row>
  )
}

export default Page
