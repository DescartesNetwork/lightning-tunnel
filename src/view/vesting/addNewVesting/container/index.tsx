import { Fragment, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import parse from 'parse-duration'

import { Button, Card, Col, Radio, Row, Tooltip, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Auto from './auto'
import Manual from './manual'
import CliffTime from '../components/cliffTime'
import Frequency from '../components/frequency'
import DistributeIn from '../components/distributeIn'
import ConfirmTransfer from 'view/confirmTransfer'
import DateOption from 'components/dateOption'
import CardOption from 'components/cardOption'
import TgeTime from './tge/tgeTime'
import TgePercent from './tge/tgePercent'
import MintInfo from 'components/mintInfo'
import Header from 'components/header'
import SelectToken, { EMPTY_SELECT_VAL } from 'components/selectTokens'

import { Method, Step } from '../../../../constants'
import { AppState } from 'model'
import { onSelectedMint, onSelectMethod } from 'model/main.controller'
import { onSelectStep } from 'model/steps.controller'
import { useAppRouter } from 'hooks/useAppRoute'
import { setExpiration } from 'model/recipients.controller'

const SelectInputMethod = () => {
  const [isUnlimited, setIsUnlimited] = useState(true)
  const method = useSelector((state: AppState) => state.main.methodSelected)
  const TGETime = useSelector((state: AppState) => state.main.TGETime)
  const cliff = useSelector((state: AppState) => state.recipients.configs.cliff)
  const expiration = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  const mintSelected = useSelector((state: AppState) => state.main.mintSelected)
  const distributeIn = useSelector(
    (state: AppState) => state.recipients.configs.distributeIn,
  )
  const frequency = useSelector(
    (state: AppState) => state.recipients.configs.frequency,
  )
  const dispatch = useDispatch()
  const { pushHistory } = useAppRouter()

  const onSelectMint = (mintAddress: string) => {
    return dispatch(onSelectedMint(mintAddress))
  }

  const onContinue = () => {
    dispatch(onSelectMethod(method))
    dispatch(onSelectStep(Step.AddRecipient))
  }

  const onExpirationChange = (value: number) => {
    const endTime = isUnlimited ? 0 : value
    return dispatch(setExpiration(endTime))
  }

  const validEndDate = useMemo(() => {
    if (isUnlimited || !expiration) return ''
    if (expiration < Date.now()) return 'Must be greater than current time.'
    const unlockTime = TGETime + parse(cliff)
    const totalVestingTime = unlockTime + parse(distributeIn)
    if (expiration < totalVestingTime && method === Method.manual)
      return 'Must be greater than the total vesting time.'
    return ''
  }, [TGETime, cliff, distributeIn, expiration, isUnlimited, method])

  const disabled = useMemo(() => {
    if (mintSelected === EMPTY_SELECT_VAL || !method) return true
    const unlockTime = TGETime + parse(cliff)
    if (method === Method.manual)
      return (
        !TGETime ||
        (expiration < unlockTime && !isUnlimited) ||
        (expiration - unlockTime < parse(distributeIn) && !isUnlimited) ||
        parse(distributeIn) < parse(frequency)
      )
    return !expiration && !isUnlimited
  }, [
    TGETime,
    cliff,
    distributeIn,
    expiration,
    frequency,
    isUnlimited,
    method,
    mintSelected,
  ])

  return (
    <Card className="card-lightning" bordered={false}>
      <Row gutter={[32, 32]} align="middle">
        <Col span={24}>
          <Header label="Select token type and input method" />
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
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
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Typography.Text>
                    Choose transfer info input method
                  </Typography.Text>
                </Col>
                <Col span={24}>
                  <Radio.Group
                    onChange={(e) => dispatch(onSelectMethod(e.target.value))}
                    style={{ width: '100%' }}
                    className="select-card"
                    value={method}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Radio.Button value={Method.manual}>
                          <CardOption
                            label="Manual"
                            description="With a small number of recipients."
                            active={method === Method.manual}
                          />
                        </Radio.Button>
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Radio.Button value={Method.auto}>
                          <CardOption
                            label="Automatic"
                            description="Support bulk import with a CSV file."
                            active={method === Method.auto}
                          />
                        </Radio.Button>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <Row gutter={[16, 16]}>
                {method === Method.manual && (
                  <Fragment>
                    <Col xs={24} md={12} xl={8}>
                      <TgePercent />
                    </Col>
                    <Col xs={24} md={12} xl={8}>
                      <TgeTime />
                    </Col>
                    <Col xs={24} md={12} xl={8}>
                      <CliffTime />
                    </Col>
                    <Col xs={24} md={12} xl={8}>
                      <Frequency />
                    </Col>
                    <Col xs={24} md={12} xl={8}>
                      <DistributeIn />
                    </Col>
                  </Fragment>
                )}
                <Col xs={24} md={12} xl={8}>
                  <DateOption
                    label="Expiration time"
                    onSwitch={setIsUnlimited}
                    switchText="Unlimited"
                    onChange={onExpirationChange}
                    placeholder="Select time"
                    value={expiration}
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
            onClick={() => pushHistory('/vesting')}
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
    return methodSelected === Method.auto ? <Auto /> : <Manual />
  return <ConfirmTransfer />
}

export default Container
