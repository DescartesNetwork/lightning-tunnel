import { Col, Row } from 'antd'
import StepPriFi from 'app/components/stepPriFi'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'
import Container from './container'

const Page = () => {
  const { methodSelected } = useSelector((state: AppState) => state.main)
  console.log(methodSelected)
  return (
    <Row gutter={[24, 24]} align="middle" justify="center">
      <Col span={5}>
        <StepPriFi step={0} />
      </Col>
      <Col span={10}>
        <Container />
      </Col>
      <Col span={5} /> {/** safe place */}
    </Row>
  )
}

export default Page
