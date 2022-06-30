import { account } from '@senswap/sen-js'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'

import { AppDispatch, AppState } from 'model'
import { onSelectStep } from 'model/steps.controller'
import { Step } from '../../constants'
import { onSelectMethod } from 'model/main.controller'
import { removeRecipients } from 'model/recipients.controller'
import useValidateAmount from 'hooks/useValidateAmount'
import useRemainingBalance from 'hooks/useRemainingBalance'

const Action = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    recipients: { recipients, errorData },
    main: { isTyping, mintSelected },
  } = useSelector((state: AppState) => state)
  const { amountError } = useValidateAmount()
  const remainingBalance = useRemainingBalance(mintSelected)

  const existedValidData = useMemo(() => {
    if (!errorData) return false
    for (const [address, amount] of errorData) {
      if (!account.isAddress(address) || !amount) return true
    }
    return false
  }, [errorData])

  const disabled =
    !recipients.length ||
    amountError ||
    existedValidData ||
    isTyping ||
    remainingBalance < 0

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
