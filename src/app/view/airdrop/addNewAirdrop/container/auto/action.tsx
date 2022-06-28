import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { RecipientFileType, SelectMethod, Step } from 'app/constants'
import useValidateAmount from 'app/hooks/useValidateAmount'
import useRemainingBalance from 'app/hooks/useRemainingBalance'
import useFilteredAirdropRecipient from 'app/hooks/airdrop/useFilteredAirdropRecipient'
import { onSelectMethod } from 'app/model/main.controller'
import { removeRecipients } from 'app/model/recipients.controller'

const Action = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { isTyping, mintSelected },
  } = useSelector((state: AppState) => state)
  const { amountError } = useValidateAmount()
  const remainingBalance = useRemainingBalance(mintSelected)
  const invalidRecipient = useFilteredAirdropRecipient({
    type: RecipientFileType.invalid,
  })
  const validRecipient = useFilteredAirdropRecipient({
    type: RecipientFileType.valid,
  })

  const disabled =
    !validRecipient.length ||
    !!invalidRecipient.length ||
    isTyping ||
    remainingBalance < 0 ||
    amountError

  const onBack = useCallback(async () => {
    await dispatch(onSelectStep(Step.SelectMethod))
    await dispatch(onSelectMethod(SelectMethod.manual))
    await dispatch(removeRecipients())
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
