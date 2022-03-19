import { ReactNode, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { BN } from '@project-serum/anchor'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import Header from 'app/components/header'
import { MintSymbol } from 'shared/antd/mint'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'
import { numeric } from 'shared/util'
import useTotal from 'app/hooks/useTotal'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import { generateCsv, notifyError, notifySuccess } from 'app/helper'

const Content = ({
  label = '',
  value = '',
}: {
  label?: string
  value?: ReactNode
}) => {
  return (
    <Row>
      <Col flex="auto">
        <Typography.Text type="secondary">{label} </Typography.Text>
      </Col>
      <Col>{value}</Col>
    </Row>
  )
}

const ConfirmTransfer = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { mintSelected },
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  const { balance } = useAccountBalanceByMintAddress(mintSelected)
  const { total, quantity } = useTotal()

  const remainingBalance = useMemo(() => {
    if (!balance) return 0
    return Number(balance) - Number(total)
  }, [balance, total])

  const onCreateVault = async () => {
    try {
      const transferInfo = recipients.map((e) => {
        return { amount: new BN(1), walletAddress: e[0] }
      })
      const { cheques, txId } = await window.lightningTunnel.initializeVault(
        mintSelected,
        transferInfo,
      )
      const csvFile = generateCsv(cheques)
      csvFile.download()
      notifySuccess('Create', txId)
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <Card bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Header label="Confirm transfer" />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]} justify="center">
            <Col>
              <Space direction="vertical" size={12} align="center">
                <Typography.Text type="secondary">
                  Total transfer
                </Typography.Text>
                <Typography.Title level={2}>{total}</Typography.Title>
                <Tag
                  style={{
                    margin: 0,
                    borderRadius: 4,
                    color: 'rgb(249, 88, 96)',
                    background: 'rgba(249, 88, 96, 0.1)',
                    border: 'unset',
                  }}
                >
                  <MintSymbol mintAddress={mintSelected} />
                </Tag>
              </Space>
            </Col>
            <Col span={24}>
              <Card bordered={false} className="card-content">
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <Content
                      label="Time"
                      value={moment(new Date()).format('DD MMM, YYYY HH:MM')}
                    />
                  </Col>
                  <Col span={24}>
                    <Content label="Quantity" value={quantity} />
                  </Col>
                  <Col span={24}>
                    <Content
                      label="Your balance"
                      value={
                        <Typography.Text>
                          {numeric(balance).format('0,0.00[0000]')}{' '}
                          <MintSymbol mintAddress={mintSelected} />
                        </Typography.Text>
                      }
                    />
                  </Col>
                  <Col span={24}>
                    <Content
                      label="Remaining"
                      value={
                        <Typography.Text>
                          {numeric(remainingBalance).format('0,0.00[00]')}{' '}
                          <MintSymbol mintAddress={mintSelected} />
                        </Typography.Text>
                      }
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Button
                size="large"
                onClick={() => dispatch(onSelectStep(Step.one))}
                block
              >
                Back
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                onClick={() => onCreateVault()}
                type="primary"
                block
                // disabled={isAuthGmail}
              >
                Confirm
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default ConfirmTransfer
