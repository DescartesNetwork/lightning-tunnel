import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount, useWallet } from '@senhub/providers'
import { account, utils } from '@senswap/sen-js'
import moment from 'moment'
import { NewFormat } from '@saberhq/merkle-distributor/dist/cjs/utils'
import { u64 } from '@saberhq/token-utils'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import Header from 'app/components/header'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'
import { MintSymbol } from 'shared/antd/mint'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { explorer, numeric } from 'shared/util'
import useTotal from 'app/hooks/useTotal'
import { createSDK } from './index'
import { utils as MerkleUtils } from '@saberhq/merkle-distributor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
// import useAppRouter from 'app/hooks/useAppRoute'
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
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState(0)
  const [distributorW, setDistributor] = useState('')
  const [encodeData, setEncodeData] = useState<Record<string, string>>({})

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
  // const { appRoute, generateQuery } = useAppRouter()

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

  const tree = useMemo(() => {
    if (!recipients.length) return
    const balanceTree: NewFormat[] = []
    Object.values(recipients).forEach(([address, email, amount]) => {
      balanceTree.push({
        address,
        earnings: utils.decimalize(amount, mintDecimals).toString(),
      })
    })
    return MerkleUtils.parseBalanceMap(balanceTree)

    // return new BalanceTree(balanceTree)
  }, [recipients, mintDecimals])

  const onConfirm = async () => {
    const sdk = await createSDK()
    if (!sdk || !account.isAddress(mintSelected) || !tree) return

    const { claims, merkleRoot } = tree
    console.log('claims: ', claims)

    setLoading(true)
    try {
      const publicKey = account.fromAddress(mintSelected)
      const { tx, distributor, distributorATA } = await sdk.createDistributor({
        tokenMint: publicKey,
        root: merkleRoot,
        maxNumNodes: new u64(quantity),
        maxTotalClaim: new u64(
          utils.decimalize(total, mintDecimals).toString(),
        ),
      })
      const pendingTx = await tx.send()
      await pendingTx.wait()
      const txId = pendingTx.signature

      console.log(distributor.toBase58(), 'address')
      console.log(distributorATA.toBase58(), 'ATA')
      setDistributor(distributor.toBase58())

      window.notify({
        type: 'success',
        description: 'Transfer successfully. Click to view details.',
        onClick: () => window.open(explorer(txId)),
      })
    } catch (err: any) {
      window.notify({ type: 'error', description: err.message })
    } finally {
      setLoading(false)
    }
  }

  const encyptData = () => {
    if (!tree) return
    const { claims } = tree
    const data: Record<string, string> = {}
    const listClamaint = Object.keys(claims)
    listClamaint.forEach((clamaint) => {
      const { amount, index, proof } = claims[clamaint]
      const newClaim = {
        index,
        proof,
        amount: amount.toString(),
        clamaint,
        distributorW,
      }
      const encyptD = bs58.encode(new Buffer(JSON.stringify(newClaim)))
      data[clamaint] = encyptD
    })
    setEncodeData(data)
  }

  // const generateChequesCsv = async (claims: any[]) => {
  //   const csvData = []
  //   for (const claim of Object.keys(encodeData)) {
  //     const redeem_link = `${window.location.origin}${appRoute}?${generateQuery(
  //       claims[],
  //     )}`

  //     const address = dataTransfer.authority
  //     const amount = dataTransfer.amount.toString()
  //     csvData.push({ address, amount, redeem_link })
  //   }
  //   const csvFile = generateCsv(csvData)
  //   csvFile.download()
  // }

  useEffect(() => {
    getBalanceAccount()
  }, [getBalanceAccount])

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
                onClick={onConfirm}
                type="primary"
                loading={loading}
                block
                // disabled={isAuthGmail}
              >
                Confirm
              </Button>
            </Col>
            <Col span={12}>
              <Button
                // onClick={generateChequesCsv}
                size="large"
                type="primary"
                loading={loading}
                block
              >
                generate csv
              </Button>
            </Col>
            <Col span={12}>
              <Button onClick={encyptData} size="large" type="primary" block>
                encryt
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default ConfirmTransfer
