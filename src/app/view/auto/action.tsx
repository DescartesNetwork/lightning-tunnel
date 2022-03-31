import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'
import { onSelectMethod } from 'app/model/main.controller'
import { removeRecipients } from 'app/model/recipients.controller'
import useValidateAmount from 'app/hooks/useValidateAmount'

const Action = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    recipients: { recipients, errorData },
  } = useSelector((state: AppState) => state)
  const { isError } = useValidateAmount()

  const disabled = useMemo(() => {
    if (!Object.keys(recipients).length || isError || errorData?.length)
      return true
    return false
  }, [errorData, isError, recipients])

  const onBack = useCallback(async () => {
    await dispatch(onSelectMethod())
    dispatch(removeRecipients())
    dispatch(onSelectStep(Step.one))
  }, [dispatch])

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Button type="ghost" size="large" onClick={onBack} block>
          Back
        </Button>
      </Col>
      <Col span={12}>
        <Button
          size="large"
          onClick={() => dispatch(onSelectStep(Step.three))}
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
