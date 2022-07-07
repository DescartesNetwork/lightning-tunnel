import { util } from '@sentre/senhub'

import { Avatar, Col, Row, Space, Typography } from 'antd'
import { useMemo } from 'react'

import { Allocation } from '../../../constants'

const CustomizedLegend = ({ data }: { data: Record<string, Allocation> }) => {
  const listToken = useMemo(() => {
    return Object.values(data).sort((a, b) => {
      return b.ratio - a.ratio
    })
  }, [data])

  return (
    <Row gutter={[12, 12]}>
      {listToken.map((item, idx) => (
        <Col span={24} key={idx}>
          <Row align="middle" wrap={false} gutter={[16, 16]}>
            <Col flex="auto">
              <Space>
                <Avatar
                  style={{ background: util.randomColor(item.symbol) }}
                  shape="square"
                  size={16}
                />
                <Typography.Text ellipsis type="secondary">
                  {item.symbol} ({item.name})
                </Typography.Text>
              </Space>
            </Col>
            <Col>
              <Typography.Text>
                {util.numeric(item.ratio).format('0,0.[00]')}%
              </Typography.Text>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  )
}

export default CustomizedLegend
