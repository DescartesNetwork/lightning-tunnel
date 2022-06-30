import { Card, Col, Row } from 'antd'
import Action from './action'
import UploadFile from './uploadFile'
import Header from 'components/header'

const Auto = () => {
  return (
    <Card bordered={false} className="card-lightning">
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Header label="Fill in recipient information" />
        </Col>
        <Col span={24}>
          <UploadFile />
        </Col>
        <Col span={24}>
          <Action />
        </Col>
      </Row>
    </Card>
  )
}

export default Auto
