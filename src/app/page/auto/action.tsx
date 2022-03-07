import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'
import { onSelectMethod } from 'app/model/main.controller'
import { removeRecipients } from 'app/model/recipients.controller'

const Action = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { recipients } = useSelector((state: AppState) => state.recipients)

  const disabled = !Object.keys(recipients).length

  const onBack = useCallback(async () => {
    await dispatch(onSelectMethod())
    dispatch(removeRecipients())
    dispatch(onSelectStep(Step.zero))
  }, [dispatch])

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Button onClick={onBack} block>
          Back
        </Button>
      </Col>
      <Col span={12}>
        <Button
          onClick={() => dispatch(onSelectStep(Step.two))}
          type="primary"
          disabled={disabled}
          block
        >
          Continue
        </Button>
      </Col>
    </Row>
  )
}
export default Action