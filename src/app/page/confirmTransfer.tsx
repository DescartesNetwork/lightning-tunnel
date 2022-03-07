import { useDispatch } from 'react-redux'
import moment from 'moment'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import PoweredBySentre from 'app/components/poweredBySentre'

import { randomColor } from 'shared/util'
import { AppDispatch } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'

const Content = ({
  label = '',
  value = '',
}: {
  label?: string
  value?: string | number
}) => {
  return (
    <Row>
      <Col flex="auto">
        <Typography.Text type="secondary">{label}</Typography.Text>
      </Col>
      <Col>
        <Typography.Text>{value}</Typography.Text>
      </Col>
    </Row>
  )
}

const ConfirmTransfer = () => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Card bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>Confirm transfer</Typography.Title>
            </Col>
            <Col>
              <PoweredBySentre />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]} justify="center">
            <Col>
              <Space direction="vertical" size={12} align="center">
                <Typography.Text type="secondary">
                  Total transfer
                </Typography.Text>
                <Typography.Title level={2}>${18000}</Typography.Title>
                <Tag
                  style={{
                    margin: 0,
                    borderRadius: 4,
                    color: randomColor('SNTR'),
                  }}
                  color={randomColor('SNTR', 0.2)}
                >
                  {'SNTR'}
                </Tag>
              </Space>
            </Col>
            <Col span={24}>
              <Card bordered={false} className="card-content">
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <Content
                      label="Time"
                      value={moment(new Date()).format('DD MMM, YYYY HH:MM')}
                    />
                  </Col>
                  <Col span={24}>
                    <Content label="Quantity" value={9} />
                  </Col>
                  <Col span={24}>
                    <Content label="Your balance" value={'16 SNTR'} />
                  </Col>
                  <Col span={24}>
                    <Content label="Remaing" value={'6 SNTR'} />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Button onClick={() => dispatch(onSelectStep(Step.one))} block>
                Back
              </Button>
            </Col>
            <Col span={12}>
              <Button type="primary" block>
                Confirm
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default ConfirmTransfer
