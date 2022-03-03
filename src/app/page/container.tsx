import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount } from '@senhub/providers'

import { Button, Card, Col, Radio, Row, Space, Typography } from 'antd'
import Auto from './auto'
import Manual from './manual'
import SelectToken from 'app/components/selectTokens'
import PoweredBySentre from 'app/components/poweredBySentre'

import { SelectMethod } from 'app/constants'
import { AppState } from 'app/model'
import { onSelectMethod } from 'app/model/main.controller'
import { useSingleMints } from 'app/hooks/useSingleMints'

const CardOption = ({
  label,
  description,
}: {
  label: string
  description: string
}) => {
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Title level={5}>{label}</Typography.Title>
          </Col>
          <Col></Col>
        </Row>
      </Col>
      <Col span={24}>
        <Typography.Text type="secondary">{description}</Typography.Text>
      </Col>
    </Row>
  )
}

const SelectInputMethod = () => {
  const [method, setMethod] = useState<number | undefined>()
  const [activeMintAddress, setActiveMintAddress] = useState('Select')
  const dispatch = useDispatch()
  const { accounts } = useAccount()

  const myMints = useMemo(
    () => Object.values(accounts).map((acc) => acc.mint),
    [accounts],
  )
  const singleMints = useSingleMints(myMints)

  const disabled = useMemo(() => {
    if (activeMintAddress === 'Select' || !method) return true
    return false
  }, [activeMintAddress, method])

  return (
    <Card className="card-priFi" bordered={false}>
      <Row gutter={[32, 32]} align="middle">
        <Col span={24}>
          <Row>
            <Col flex="auto" />
            <Col>
              <PoweredBySentre />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <SelectToken
                activeMintAddress={activeMintAddress}
                tokens={singleMints}
                onSelect={(mintAddress) => setActiveMintAddress(mintAddress)}
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
                    <Col span={12}>
                      <Radio.Button value={SelectMethod.manual}>
                        <CardOption
                          label="Manual"
                          description="With a small number of recipients."
                        />
                      </Radio.Button>
                    </Col>
                    <Col span={12}>
                      <Radio.Button value={SelectMethod.auto}>
                        <CardOption
                          label="Automatic"
                          description="Support importing many recipient information quickly by CSV file."
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
            onClick={() => dispatch(onSelectMethod(method))}
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
  const { methodSelected } = useSelector((state: AppState) => state.main)
  if (!methodSelected) return <SelectInputMethod />
  return methodSelected === SelectMethod.auto ? <Auto /> : <Manual />
}

export default Container
