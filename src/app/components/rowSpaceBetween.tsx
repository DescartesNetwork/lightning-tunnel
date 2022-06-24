import { ReactNode } from 'react'

import { Col, Row, Typography } from 'antd'

type RowSpaceBetweenProps = {
  label: string
  value: ReactNode
}
const RowSpaceBetween = ({ label = '', value = '' }: RowSpaceBetweenProps) => {
  return (
    <Row align="middle" gutter={[24, 24]}>
      <Col flex="auto">
        <Typography.Text type="secondary">{label}</Typography.Text>
      </Col>
      <Col>{value}</Col>
    </Row>
  )
}

export default RowSpaceBetween
