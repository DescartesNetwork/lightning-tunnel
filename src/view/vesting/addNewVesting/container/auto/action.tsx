import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import CommonModal from 'components/commonModal'

import { AppDispatch, AppState } from 'model'
import { onSelectStep } from 'model/steps.controller'
import { RecipientFileType, Step } from '../../../../../constants'
import useValidateAmount from 'hooks/useValidateAmount'
import useRemainingBalance from 'hooks/useRemainingBalance'
import useFilteredVestingRecipient from 'hooks/vesting/useFilteredVestingRecipients'
import { setTGE } from 'model/main.controller'
import { removeRecipients, setExpiration } from 'model/recipients.controller'

const Action = () => {
  const [visible, setVisible] = useState(false)
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
    dispatch(setTGE(''))
    dispatch(setExpiration(0))
    dispatch(removeRecipients())
  }, [dispatch])

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Button
          type="ghost"
          size="large"
          onClick={() => setVisible(true)}
          block
        >
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
      <CommonModal
        visible={visible}
        setVisible={setVisible}
        onCancel={() => setVisible(false)}
        title="Are you sure you want to go back?"
        description="Your data will not be saved."
        btnText="go back"
        onConfirm={onBack}
      />
    </Row>
  )
}
export default Action
