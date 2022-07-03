import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'

import { AppDispatch, AppState } from 'model'
import { onSelectStep } from 'model/steps.controller'
import { RecipientFileType, Step } from '../../../../constants'
import useValidateAmount from 'hooks/useValidateAmount'
import useRemainingBalance from 'hooks/useRemainingBalance'
import useFilteredVestingRecipient from 'hooks/vesting/useFilteredVestingRecipients'

const Action = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { isTyping, mintSelected },
  } = useSelector((state: AppState) => state)
  const { amountError } = useValidateAmount()
  const remainingBalance = useRemainingBalance(mintSelected)
  const invalidRecipient = useFilteredVestingRecipient({
    type: RecipientFileType.invalid,
  })

  const disabled =
    !!invalidRecipient.length || isTyping || remainingBalance < 0 || amountError

  const onBack = useCallback(async () => {
    dispatch(onSelectStep(Step.SelectMethod))
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
          onClick={() => dispatch(onSelectStep(Step.ConfirmTransfer))}
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
