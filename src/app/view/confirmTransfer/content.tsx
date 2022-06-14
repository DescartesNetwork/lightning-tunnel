import { ReactNode } from 'react'

import { Col, Row, Typography } from 'antd'

export type ContentProps = {
  label?: string
  value?: ReactNode
}

const Content = ({ label = '', value = '' }: ContentProps) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text type="secondary">{label} </Typography.Text>
      </Col>
      <Col span={24}>{value}</Col>
    </Row>
  )
}

export default Content
