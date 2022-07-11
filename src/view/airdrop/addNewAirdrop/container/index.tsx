import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from '@sentre/senhub'

import { Button, Card, Col, Radio, Row, Space, Typography } from 'antd'
import SelectToken from 'components/selectTokens'
import Header from 'components/header'
import Auto from './auto'
import Manual from './manual'
import ConfirmTransfer from '../../../confirmTransfer'
import DateOption from '../../../../components/dateOption'
import CardOption from 'components/cardOption'

import { SelectMethod, Step } from '../../../../constants'
import { AppState } from 'model'
import { onSelectedMint, onSelectMethod } from 'model/main.controller'
import { useSingleMints } from 'hooks/useSingleMints'
import { onSelectStep } from 'model/steps.controller'
import { setExpiration, setGlobalUnlockTime } from 'model/recipients.controller'
import { useAppRouter } from 'hooks/useAppRoute'

const SelectInputMethod = () => {
  const { expirationTime: endDate, globalUnlockTime } = useSelector(
    (state: AppState) => state.recipients,
  )
  const [method, setMethod] = useState<number>(SelectMethod.manual)
  const [activeMintAddress, setActiveMintAddress] = useState('Select')
  const [unlockTime, setUnlockTime] = useState(globalUnlockTime)
  const [expirationTime, setExpirationTime] = useState(endDate)
  const [isSendNow, setIsSendNow] = useState(true)
  const [isUnlimited, setIsUnlimited] = useState(true)
  const dispatch = useDispatch()
  const { accounts } = useAccount()
  const { pushHistory } = useAppRouter()

  const myMints = useMemo(
    () => Object.values(accounts).map((acc) => acc.mint),
    [accounts],
  )
  const singleMints = useSingleMints(myMints)

  const startTime = useMemo(() => {
    return isSendNow ? 0 : unlockTime
  }, [isSendNow, unlockTime])

  const endTime = useMemo(() => {
    return isUnlimited ? 0 : expirationTime
  }, [expirationTime, isUnlimited])

  const validStartDate = useMemo(() => {
    if (expirationTime < globalUnlockTime && !isSendNow && expirationTime)
      return 'Must be less than the expiration time.'
    return ''
  }, [expirationTime, globalUnlockTime, isSendNow])

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
    setActiveMintAddress(mintAddress)
    dispatch(onSelectedMint(mintAddress))
  }

  const disabled =
    activeMintAddress === 'Select' ||
    !method ||
    (!unlockTime && !isSendNow) ||
    (!expirationTime && !isUnlimited) ||
    (expirationTime < globalUnlockTime && !isUnlimited) ||
    (expirationTime < Date.now() && !isUnlimited)

  useEffect(() => {
    dispatch(setGlobalUnlockTime(startTime))
    dispatch(setExpiration(endTime))
  }, [dispatch, endTime, startTime])

  return (
    <Card className="card-lightning" bordered={false}>
      <Row gutter={[32, 32]} align="middle">
        <Col span={24}>
          <Header label="Select token type and input method" />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <SelectToken
                activeMintAddress={activeMintAddress}
                tokens={singleMints}
                onSelect={onSelectMint}
              />
            </Col>
            <Col span={24}>
              <Space size={12} direction="vertical" style={{ width: '100%' }}>
                <Typography.Text>
                  Choose transfer info input method
                </Typography.Text>
                <Radio.Group
                  onChange={(e) => setMethod(e.target.value)}
                  style={{ width: '100%' }}
                  className="select-card"
                >
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <Radio.Button value={SelectMethod.manual}>
                        <CardOption
                          label="Manual"
                          description="With a small number of recipients."
                          active={method === SelectMethod.manual}
                        />
                      </Radio.Button>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <Radio.Button value={SelectMethod.auto}>
                        <CardOption
                          label="Automatic"
                          description="Support bulk import with a CSV file."
                          active={method === SelectMethod.auto}
                        />
                      </Radio.Button>
                    </Col>
                  </Row>
                </Radio.Group>
              </Space>
            </Col>
            <Col span={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <DateOption
                    label="Unlock time"
                    onSwitch={setIsSendNow}
                    switchText="Send immediately"
                    onChange={setUnlockTime}
                    placeholder="Select unlock time"
                    value={unlockTime}
                    error={validStartDate}
                    checked={isSendNow}
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

const Container = () => {
  const {
    main: { methodSelected },
    steps: { step },
  } = useSelector((state: AppState) => state)

  if (step === Step.SelectMethod) return <SelectInputMethod />
  if (step === Step.AddRecipient)
    return methodSelected === SelectMethod.auto ? <Auto /> : <Manual />
  return <ConfirmTransfer />
}

export default Container
