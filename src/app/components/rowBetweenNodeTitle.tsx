import { ReactNode } from 'react'

import { Col, Row } from 'antd'

type RowBetweenNodeTitleProps = { title?: ReactNode; children?: ReactNode }
const RowBetweenNodeTitle = ({ title, children }: RowBetweenNodeTitleProps) => {
  return (
    <Row align="middle" gutter={[24, 24]}>
      <Col flex="auto">{title}</Col>
      <Col>{children}</Col>
    </Row>
  )
}

export default RowBetweenNodeTitle
