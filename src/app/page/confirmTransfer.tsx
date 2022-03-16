import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount, useWallet } from '@senhub/providers'
import { utils } from '@senswap/sen-js'
import { encodeBase64 } from 'tweetnacl-util'
import moment from 'moment'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import Header from 'app/components/header'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'
import { MintSymbol } from 'shared/antd/mint'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { numeric } from 'shared/util'
import useTotal from 'app/hooks/useTotal'
import { TransferData, signCheques, Cheque, keyPair } from 'app/lib/cryptoKey'

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
  const [balance, setBalance] = useState(0)
  const [listSig, setListSig] = useState<Cheque[]>([])
  const {
    main: { mintSelected },
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const { accounts } = useAccount()
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const { total, quantity } = useTotal()

  const getBalanceAccount = useCallback(async () => {
    const { splt } = window.sentre
    const accountAddress = await splt.deriveAssociatedAddress(
      walletAddress,
      mintSelected,
    )
    const { amount } = accounts[accountAddress] || {}
    if (!amount) return setBalance(0)
    return setBalance(Number(utils.undecimalize(amount, mintDecimals)))
  }, [accounts, mintDecimals, mintSelected, walletAddress])

  const remainingBalance = useMemo(() => {
    if (!balance) return 0
    return Number(balance) - Number(total)
  }, [balance, total])

  useEffect(() => {
    getBalanceAccount()
  }, [getBalanceAccount])

  const dataTransfer = useMemo(() => {
    const transferData: TransferData[] = []
    recipients.forEach(([address, email, amount]) => {
      const transfer: TransferData = {
        src: walletAddress,
        des: address,
        amount,
        email,
        startDate: moment(new Date()).format('YYYY/MM/DD'),
        endDate: moment(new Date()).format('YYYY/MM/DD'),
      }
      transferData.push(transfer)
    })
    return transferData
  }, [recipients, walletAddress])

  const signDataTransfer = useCallback(() => {
    if (!dataTransfer) return
    const signatures = signCheques(dataTransfer)
    return setListSig(signatures)
  }, [dataTransfer])

  useEffect(() => {
    signDataTransfer()
  }, [signDataTransfer])

  console.log('listSig: ', listSig, encodeBase64(keyPair.publicKey))

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
              <Button size="large" disabled={false} type="primary" block>
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
