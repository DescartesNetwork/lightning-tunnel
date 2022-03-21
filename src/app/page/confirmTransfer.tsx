import { ReactNode, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { BN } from '@project-serum/anchor'
import { utils } from '@senswap/sen-js'
import { ChequeData } from '@senswap/lightning-tunnel/dist/lib/cheque'

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
import { useAppRouter } from 'app/hooks/useAppRoute'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { TransferInfo } from '@senswap/lightning-tunnel'

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
  const { appRoute, generateQuery } = useAppRouter()
  const decimals = useMintDecimals(mintSelected) || 0

  const remainingBalance = useMemo(() => {
    if (!balance) return 0
    return Number(balance) - Number(total)
  }, [balance, total])

  const generateChequesCsv = async (cheques: ChequeData[]) => {
    const csvData = []
    for (const cheque of cheques) {
      const redeem_link = `${window.location.origin}${appRoute}?${generateQuery(
        cheque,
      )}`
      const dataTransfer = await window.lightningTunnel.parseTransferData(
        cheque.transferData,
      )
      const address = dataTransfer.authority
      const amount = dataTransfer.amount.toString()
      csvData.push({ address, amount, redeem_link })
    }
    const csvFile = generateCsv(csvData)
    csvFile.download()
  }

  const onCreateVault = async () => {
    try {
      const transferInfo: TransferInfo[] = recipients.map((recipient) => {
        const amount = utils.decimalize(recipient[2], decimals).toString()
        return {
          amount: new BN(amount),
          walletAddress: recipient[0],
          vestingNumber: new BN(0),
          vestingTime: new BN(0),
        }
      })
      const { cheques, txId } = await window.lightningTunnel.initializeVault(
        mintSelected,
        transferInfo,
        { startTime: new BN(0), endTime: new BN(0) },
      )
      await generateChequesCsv(cheques)
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
