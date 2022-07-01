import { util } from '@sentre/senhub'

import { Col, Row, Space, Typography } from 'antd'

import { AllocationType } from '../../../constants'

import './customizedLegend.less'

const CustomizedLegend = ({
  data,
}: {
  data: Record<string, AllocationType>
}) => {
  return (
    <Row className="customized-legend" gutter={[12, 12]}>
      {Object.values(data).map((item) => (
        <Col span={24}>
          <Row align="middle" wrap={false} gutter={[16, 16]}>
            <Col
              style={{
                width: 18,
                height: 14,
                background: util.randomColor(item.symbol),
              }}
            />
            <Col flex={2}>
              <Typography.Text ellipsis style={{ color: '#A7ADAD' }}>
                {item.symbol} ({item.name})
              </Typography.Text>
            </Col>
            <Col flex={1}>
              <Space
                direction="vertical"
                align="end"
                style={{ width: '100%', color: '#F4F5F5' }}
              >
                {util.numeric(item.ratio).format('0,0.[00]%')}
              </Space>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  )
}

export default CustomizedLegend
