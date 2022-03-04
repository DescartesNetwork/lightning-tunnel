import { Card, Col, Row, Typography } from 'antd'
import PoweredBySentre from 'app/components/poweredBySentre'
import Action from './action'
import UploadFile from './uploadFile'

const Auto = () => {
  return (
    <Card bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>
                Fill in recipient information
              </Typography.Title>
            </Col>
            <Col>
              <PoweredBySentre />
            </Col>
          </Row>
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
