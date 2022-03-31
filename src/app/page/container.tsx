import { Fragment, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from '@senhub/providers'

import { Button, Card, Col, Radio, Row, Space, Typography } from 'antd'
import Auto from './auto'
import Manual from './manual'
import SelectToken from 'app/components/selectTokens'
import IonIcon from 'shared/antd/ionicon'
import Header from 'app/components/header'

import { SelectMethod, Step } from 'app/constants'
import { AppState } from 'app/model'
import { onSelectedMint, onSelectMethod } from 'app/model/main.controller'
import { useSingleMints } from 'app/hooks/useSingleMints'
import { onSelectStep } from 'app/model/steps.controller'
import ConfirmTransfer from './confirmTransfer'

const CardOption = ({
  label,
  description,
  active,
}: {
  label: string
  description: string
  active: boolean
}) => {
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
          <Header label="Select a token and filled type" />
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
                  Fill in information transfer by
                </Typography.Text>
                <Radio.Group
                  onChange={(e) => setMethod(e.target.value)}
                  style={{ width: '100%' }}
                  className="select-card"
                >
                  <Row gutter={[12, 12]}>
                    <Col xs={24} lg={12}>
                      <Radio.Button value={SelectMethod.manual}>
                        <CardOption
                          label="Manual"
                          description="With a small number of recipients."
                          active={method === SelectMethod.manual}
                        />
                      </Radio.Button>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Radio.Button value={SelectMethod.auto}>
                        <CardOption
                          label="Automatic"
                          description="Support importing many recipient information quickly by CSV file."
                          active={method === SelectMethod.auto}
                        />
                      </Radio.Button>
                    </Col>
                  </Row>
                </Radio.Group>
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

  if (!methodSelected) return <SelectInputMethod />
  if (step === Step.two)
    return methodSelected === SelectMethod.auto ? <Auto /> : <Manual />
  return <ConfirmTransfer />
}

export default Container
