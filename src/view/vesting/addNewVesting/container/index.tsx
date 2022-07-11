import { Fragment, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from '@sentre/senhub'

import { Button, Card, Col, Radio, Row, Space, Switch, Typography } from 'antd'
import Auto from './auto'
import Manual from './manual'
import UnlockTime from '../components/unlockTime'
import Frequency from '../components/frequency'
import DistributeIn from '../components/distributeIn'
import AddUnlockTime from '../components/addUnlockTime'
import ConfirmTransfer from 'view/confirmTransfer'
import DateOption from 'components/dateOption'
import CardOption from 'components/cardOption'
import SelectToken from 'components/selectTokens'
import Header from 'components/header'

import { ONE_DAY, SelectMethod, Step } from '../../../../constants'
import { useSingleMints } from 'hooks/useSingleMints'
import { AppState } from 'model'
import { onSelectedMint, onSelectMethod } from 'model/main.controller'
import { onSelectStep } from 'model/steps.controller'
import {
  Configs,
  setExpiration,
  setGlobalConfigs,
  setGlobalUnlockTime,
} from 'model/recipients.controller'
import {
  setAdvancedMode,
  setListUnlockTime,
} from 'model/advancedMode.controller'
import { useAppRouter } from 'hooks/useAppRoute'

const SelectInputMethod = () => {
  const [activeMintAddress, setActiveMintAddress] = useState('Select')
  const [isUnlimited, setIsUnlimited] = useState(true)
  const method = useSelector((state: AppState) => state.main.methodSelected)
  const advanced = useSelector(
    (state: AppState) => state.advancedMode.isAdvancedMode,
  )
  const listUnlockTime = useSelector(
    (state: AppState) => state.advancedMode.listUnlockTime,
  )
  const expiration = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  const unlockTime = useSelector(
    (state: AppState) => state.recipients.globalUnlockTime,
  )
  const frequency = useSelector(
    (state: AppState) => state.recipients.globalConfigs.frequency,
  )
  const distributeIn = useSelector(
    (state: AppState) => state.recipients.globalConfigs.distributeIn,
  )
  const dispatch = useDispatch()
  const { accounts } = useAccount()
  const { pushHistory } = useAppRouter()

  const myMints = useMemo(
    () => Object.values(accounts).map((acc) => acc.mint),
    [accounts],
  )
  const singleMints = useSingleMints(myMints)

  const onSelectMint = (mintAddress: string) => {
    setActiveMintAddress(mintAddress)
    dispatch(onSelectedMint(mintAddress))
  }

  const onContinue = () => {
    dispatch(onSelectMethod(method))
    dispatch(onSelectStep(Step.AddRecipient))
  }

  const onExpirationChange = (value: number) => {
    const endTime = isUnlimited ? 0 : value
    return dispatch(setExpiration(endTime))
  }

  const onConfigChange = (configs: Partial<Configs>) => {
    return dispatch(setGlobalConfigs({ configs }))
  }

  const onChangeAdvanced = (isAdvanced: boolean) => {
    if (isAdvanced) dispatch(onSelectMethod(SelectMethod.manual))
    return dispatch(setAdvancedMode(isAdvanced))
  }

  const validEndDate = useMemo(() => {
    if (isUnlimited || !expiration) return ''
    if (expiration < Date.now()) return 'Must be greater than current time.'
    const totalVestingTime = unlockTime + distributeIn * 30 * ONE_DAY
    if (expiration < totalVestingTime && method === SelectMethod.manual)
      return 'Must be greater than the total vesting time.'
    return ''
  }, [distributeIn, expiration, isUnlimited, method, unlockTime])

  const disabled = useMemo(() => {
    if (activeMintAddress === 'Select' || !method) return true
    if (advanced)
      return (
        (!expiration && !isUnlimited) ||
        !listUnlockTime.length ||
        listUnlockTime.includes(0)
      )
    if (method === SelectMethod.manual)
      return (
        !unlockTime ||
        (expiration < unlockTime && !isUnlimited) ||
        (expiration - unlockTime < distributeIn * 30 * ONE_DAY && !isUnlimited)
      )
    return !expiration && !isUnlimited
  }, [
    activeMintAddress,
    advanced,
    distributeIn,
    expiration,
    isUnlimited,
    method,
    unlockTime,
    listUnlockTime,
  ])

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
              <Row gutter={[12, 12]}>
                <Col flex="auto">
                  <Typography.Text>
                    Choose transfer info input method
                  </Typography.Text>
                </Col>
                <Col>
                  <Space>
                    <Typography.Text>Advanced mode</Typography.Text>
                    <Switch checked={advanced} onChange={onChangeAdvanced} />
                  </Space>
                </Col>
                <Col span={24}>
                  <Radio.Group
                    onChange={(e) => dispatch(onSelectMethod(e.target.value))}
                    style={{ width: '100%' }}
                    className="select-card"
                    value={method}
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
                        <Radio.Button
                          disabled={advanced}
                          value={SelectMethod.auto}
                        >
                          <CardOption
                            label="Automatic"
                            description="Support bulk import with a CSV file."
                            active={method === SelectMethod.auto}
                          />
                        </Radio.Button>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Col>
              </Row>
            </Col>
            {advanced && (
              <Col span={24}>
                <AddUnlockTime
                  listUnlockTime={listUnlockTime}
                  setListUnlockTime={(value) =>
                    dispatch(setListUnlockTime(value))
                  }
                />
              </Col>
            )}
            <Col span={24}>
              <Row gutter={[16, 16]}>
                {method === SelectMethod.manual && !advanced && (
                  <Fragment>
                    <Col xs={24} md={12} xl={6}>
                      <UnlockTime
                        unlockTime={unlockTime}
                        onChange={(value) =>
                          dispatch(setGlobalUnlockTime(value))
                        }
                      />
                    </Col>
                    <Col xs={24} md={12} xl={6}>
                      <Frequency
                        frequency={frequency}
                        onChange={(value) =>
                          onConfigChange({ frequency: value })
                        }
                      />
                    </Col>
                    <Col xs={24} md={12} xl={6}>
                      <DistributeIn
                        distributeIn={distributeIn}
                        onChange={(value) =>
                          onConfigChange({ distributeIn: value })
                        }
                      />
                    </Col>
                  </Fragment>
                )}
                <Col xs={24} md={12} xl={6}>
                  <DateOption
                    label="Expiration time"
                    onSwitch={setIsUnlimited}
                    switchText="Unlimited"
                    onChange={onExpirationChange}
                    placeholder="Select time"
                    value={expiration}
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
    return methodSelected === SelectMethod.auto ? <Auto /> : <Manual />
  return <ConfirmTransfer />
}

export default Container
