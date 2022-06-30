import { Fragment, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from '@sentre/senhub'

import {
  Button,
  Card,
  Checkbox,
  Col,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Auto from './auto'
import Manual from './manual'
import SelectToken from 'components/selectTokens'
import Header from 'components/header'
import ConfirmTransfer from './confirmTransfer'

import { SelectMethod, Step } from '../constants'
import { AppState } from 'model'
import { onSelectedMint, onSelectMethod } from 'model/main.controller'
import { useSingleMints } from 'hooks/useSingleMints'
import { onSelectStep } from 'model/steps.controller'

export type CardOptionProps = {
  label: string
  description: string
  active: boolean
}

const CardOption = ({ label, description, active }: CardOptionProps) => {
  return (
    <Fragment>
      {active ? (
        <IonIcon
          name="checkbox-sharp"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            color: '#42E6EB',
            fontSize: 20,
          }}
        />
      ) : null}
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Typography.Title level={5}>{label}</Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Text type="secondary">{description}</Typography.Text>
        </Col>
      </Row>
    </Fragment>
  )
}

const SelectInputMethod = () => {
  const [confirmed, setConfirmed] = useState(false)
  const [method, setMethod] = useState<number>(SelectMethod.manual)
  const [activeMintAddress, setActiveMintAddress] = useState('Select')
  const dispatch = useDispatch()
  const { accounts } = useAccount()

  const myMints = useMemo(
    () => Object.values(accounts).map((acc) => acc.mint),
    [accounts],
  )
  const singleMints = useSingleMints(myMints)

  const onContinue = () => {
    dispatch(onSelectMethod(method))
    dispatch(onSelectStep(Step.two))
  }

  const onSelectMint = (mintAddress: string) => {
    setActiveMintAddress(mintAddress)
    dispatch(onSelectedMint(mintAddress))
  }

  const disabled = useMemo(() => {
    if (activeMintAddress === 'Select' || !method) return true
    return false
  }, [activeMintAddress, method])

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
              <Space align="start">
                <Checkbox
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                <Typography.Text>
                  I understand this function is to create an airdrop,
                  distribution, or retroactive, but not to receive distributed
                  tokens.
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Button
            size="large"
            onClick={onContinue}
            block
            type="primary"
            disabled={disabled || !confirmed}
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

  if (!methodSelected) return <SelectInputMethod />
  if (step === Step.two)
    return methodSelected === SelectMethod.auto ? <Auto /> : <Manual />
  return <ConfirmTransfer />
}

export default Container