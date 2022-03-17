import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount, useWallet } from '@senhub/providers'
import { utils } from '@senswap/sen-js'
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
import AuthGmailApi from 'app/components/authGmailApi'
import { onSendMessage } from 'app/helper'

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

  const listEmails = recipients.map((item) => item[1])
  const argsMsg = {
    from: 'hi@sentre.com',
    to: listEmails,
    subject: 'You have many reward. Claim now.',
    message: `<table style="background: #f7f7f7; border-radius: 8px; padding:32px;margin: 25px auto;" width="350px"><tbody><tr style="text-align: center; margin-bottom: 24px"><td colspan="2"><h4 style="font-family: "open sans", "helvetica neue", sans-serif;margin: 0">Your payment is here.</h4></td></tr><tr style="text-align: center; margin-bottom: 24px"><td colspan="2"><span style="font-size: 14px">You have just received the token, please check the amount and wallet address then click Collect.</span></td></tr><tr><td><span style="color: #7A7B85">Collection deadline</span></td><td style="text-align: right"><span>16 Nov, 2021 16:00</span></td></tr><tr><td><span style="color: #7A7B85">From wallet address</span></td><td style="text-align: right"><span>8r2t...wdsy</span></td></tr></tr><tr><td><span style="color: #7A7B85">Receiving wallet address</span></td><td style="text-align: right"><span>DS8G...9wAv</span></td></tr><tr><td><span style="color: #7A7B85">Amount</span></td><td style="text-align: right"><span style="color: #F9575E; font-size: 20px; line-height: 28px">1000 SNTR</span></td></tr></tr><tr style="text-align: center; margin-top: 24px"><td colspan="2"><a style="color: #fff;background: #F9575E; border-radius: 8px; padding: 9px 16px; text-decoration: unset" href="${window.location.origin}/app/lighting_tunnel?redeem=true&address=${walletAddress}" target="_blank">Collect</a></td></tr></tbody><table/>`,

    // '<div style="display: flex; flex: 0 0 100%; flex-wrap: wrap; gap: 32px; justify-content: center; padding: 32px; width: 350px; margin: 25px auto; border-radius: 24px; box-shadow: 0 0 15px 5px #dadada"><h4 style="margin: 0">Your payment is here!</h4><p style="margin: 0">You have just received the token, please check the amount and wallet address then click Collect.</p><div style="display: flex; width: 100%; flex: 0 0 100%; flex-wrap: wrap; justify-content: space-between;"><span>Collection deadline</span><span>16 Nov, 2021 16:00</span> <div style="width: 100%"></div><span>From wallet address</span> <span>8r2t...wdsy</span><div style="width: 100%"></div><span>Receiving wallet address</span> <span>DS8G...9wAv</span><div style="width: 100%"></div><span>Amount</span> <span>1000 SNTR</span></div><a style="color: #fff;background: #F9575E; border-radius: 8px; padding: 9px 16px; text-decoration: unset" href="http://localhost:3000/app/lighting_tunnel?redeem&" target="_blank">Collect</a></div>',
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
          <AuthGmailApi />
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
                onClick={() => onSendMessage(argsMsg)}
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
