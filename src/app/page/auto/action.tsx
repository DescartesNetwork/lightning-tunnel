import { useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import { AppState } from 'app/model'

const Action = () => {
  const {
    main: { data },
  } = useSelector((state: AppState) => state)
  const disabled = !data.length
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Button onClick={() => {}} block>
          Back
        </Button>
      </Col>
      <Col span={12}>
        <Button onClick={() => {}} type="primary" disabled={disabled} block>
          Continue
        </Button>
      </Col>
    </Row>
  )
}
export default Action
