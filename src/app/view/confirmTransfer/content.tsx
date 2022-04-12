import { ReactNode } from 'react'

import { Col, Row, Typography } from 'antd'

export type ContentProps = {
  label?: string
  value?: ReactNode
}

const Content = ({ label = '', value = '' }: ContentProps) => {
  return (
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Typography.Text type="secondary">{label} </Typography.Text>
      </Col>
      <Col>{value}</Col>
    </Row>
  )
}

export default Content
