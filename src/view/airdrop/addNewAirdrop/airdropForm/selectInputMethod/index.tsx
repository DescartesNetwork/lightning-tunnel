import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Tooltip } from 'antd'
import SelectToken, { EMPTY_SELECT_VAL } from 'components/selectTokens'
import Header from 'components/header'
import DateOption from 'components/dateOption'
import MintInfo from 'components/mintInfo'
import ChooseMethodTransfer from './chooseMethodTransfer'

import { AppState } from 'model'
import { Method, Step } from '../../../../../constants'
import { onSelectStep } from 'model/steps.controller'
import { onSelectedMint, onSelectMethod } from 'model/main.controller'
import { setExpiration, setGlobalUnlockTime } from 'model/recipients.controller'
import { useAppRouter } from 'hooks/useAppRoute'

const SelectInputMethod = () => {
  const dispatch = useDispatch()
  const { expirationTime: endDate, globalUnlockTime } = useSelector(
    (state: AppState) => state.recipients,
  )
  const mintSelected = useSelector((state: AppState) => state.main.mintSelected)
  const [method, setMethod] = useState<Method>(Method.manual)
  const [unlockTime, setUnlockTime] = useState(Date.now())
  const [expirationTime, setExpirationTime] = useState(endDate)
  const [isUnlimited, setIsUnlimited] = useState(true)
  const { pushHistory } = useAppRouter()

  const endTime = useMemo(() => {
    return isUnlimited ? 0 : expirationTime
  }, [expirationTime, isUnlimited])

  const validStartDate = useMemo(() => {
    if (expirationTime < globalUnlockTime && expirationTime)
      return 'Must be less than the expiration time.'
    return ''
  }, [expirationTime, globalUnlockTime])

  const validEndDate = useMemo(() => {
    if (expirationTime < Date.now() && !isUnlimited && expirationTime)
      return 'Must be greater than current time.'
    return ''
  }, [expirationTime, isUnlimited])

  const onContinue = () => {
    dispatch(onSelectMethod(method))
    dispatch(onSelectStep(Step.AddRecipient))
  }

  const onSelectMint = (mintAddress: string) => {
    dispatch(onSelectedMint(mintAddress))
  }

  const disabled =
    mintSelected === EMPTY_SELECT_VAL ||
    !method ||
    !unlockTime ||
    (!expirationTime && !isUnlimited) ||
    (expirationTime < globalUnlockTime && !isUnlimited) ||
    (expirationTime < Date.now() && !isUnlimited)

  useEffect(() => {
    dispatch(setGlobalUnlockTime(unlockTime))
    dispatch(setExpiration(endTime))
  }, [dispatch, endTime, unlockTime])

  return (
    <Card className="card-lightning" bordered={false}>
      <Row gutter={[32, 32]} align="middle">
        <Col span={24}>
          <Header label="Select token type and input method" />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={24} xl={12}>
              <SelectToken
                activeMintAddress={mintSelected}
                onSelect={onSelectMint}
              />
            </Col>
            <Col xs={24} md={24} xl={12}>
              <MintInfo mintAddress={mintSelected} />
            </Col>
            <Col span={24}>
              <ChooseMethodTransfer
                method={method}
                onChange={(method) => setMethod(method)}
              />
            </Col>
            <Col span={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <DateOption
                    label="Unlock time"
                    switchText="Send immediately"
                    onChange={setUnlockTime}
                    placeholder="Select unlock time"
                    value={unlockTime}
                    error={validStartDate}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <DateOption
                    label="Expiration time"
                    onSwitch={setIsUnlimited}
                    switchText="Unlimited"
                    onChange={setExpirationTime}
                    placeholder="Select time"
                    value={expirationTime}
                    error={validEndDate}
                    checked={isUnlimited}
                    explain={
                      <Tooltip title="Vesting expiration time, after this time users will not be able to claim the token and you can get it back.">
                        <IonIcon name="information-circle-outline" />
                      </Tooltip>
                    }
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Button
            size="large"
            onClick={() => pushHistory('/airdrop')}
            block
            type="ghost"
          >
            Cancel
          </Button>
        </Col>
        <Col span={12}>
          <Button
            size="large"
            onClick={onContinue}
            block
            type="primary"
            disabled={disabled}
          >
            Continue
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default SelectInputMethod
