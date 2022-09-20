import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import CommonModal from 'components/commonModal'

import { AppDispatch, AppState } from 'model'
import { onSelectStep } from 'model/steps.controller'
import { onSelectMethod } from 'model/main.controller'
import {
  removeRecipients,
  setExpiration,
  setGlobalUnlockTime,
} from 'model/recipients.controller'
import { RecipientFileType, Method, Step } from '../../../../../constants'
import useValidateAmount from 'hooks/useValidateAmount'
import useRemainingBalance from 'hooks/useRemainingBalance'
import useFilteredAirdropRecipient from 'hooks/airdrop/useFilteredAirdropRecipient'

const Action = () => {
  const [visible, setVisible] = useState(false)
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
    await dispatch(setGlobalUnlockTime(0))
    await dispatch(setExpiration(0))
    await dispatch(onSelectStep(Step.SelectMethod))
    await dispatch(onSelectMethod(Method.manual))
    await dispatch(removeRecipients())
    return setVisible(false)
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
