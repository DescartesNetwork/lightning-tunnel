import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row } from 'antd'
import Auto from './auto'
import Manual from './manual'

import { SelectMethod } from 'app/constants'
import { AppState } from 'app/model'
import { onSelectMethod } from 'app/model/main.controller'

const SelectInputMethod = () => {
  const [method, setMethod] = useState<number | undefined>()
  const dispatch = useDispatch()
  return (
    <Card className="card-priFi" bordered={false} style={{ borderRadius: 16 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col span={12}>
              <Button onClick={() => setMethod(SelectMethod.auto)}>Auto</Button>
            </Col>
            <Col span={12}>
              <Button onClick={() => setMethod(SelectMethod.manual)}>
                Manual
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Button
            onClick={() => dispatch(onSelectMethod(method))}
            block
            type="primary"
          >
            Continue
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

const Container = () => {
  const { methodSelected } = useSelector((state: AppState) => state.main)
  if (!methodSelected) return <SelectInputMethod />
  return methodSelected === SelectMethod.auto ? <Auto /> : <Manual />
}

export default Container
