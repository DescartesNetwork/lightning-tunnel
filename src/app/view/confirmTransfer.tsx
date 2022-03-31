import moment from 'moment'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAccount, useWallet } from '@senhub/providers'
import { account, utils } from '@senswap/sen-js'
import { NewFormat } from '@saberhq/merkle-distributor/dist/cjs/utils'
import { utils as MerkleUtils } from '@saberhq/merkle-distributor'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import Header from 'app/components/header'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { History, Step } from 'app/constants'
import { explorer, numeric } from 'shared/util'
import { MintSymbol } from 'shared/antd/mint'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import useTotal from 'app/hooks/useTotal'
import useMerkleSDK from 'app/hooks/useMerkleSDK'
import { encodeData, toU64 } from 'app/helper'
import { useAppRouter } from 'app/hooks/useAppRoute'
import PDB from 'shared/pdb'
import IPFS from 'shared/pdb/ipfs'
import ModalShare from 'app/components/modalShare'

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
  const [visible, setVisible] = useState(false)
  const [redeemLink, setRedeemLink] = useState('')
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
  const sdk = useMerkleSDK()
  const { appRoute, generateQuery } = useAppRouter()

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
    return Number(balance) - Number(utils.undecimalize(total, mintDecimals))
  }, [balance, mintDecimals, total])

  const tree = useMemo(() => {
    if (!recipients.length) return
    const balanceTree: NewFormat[] = []
    Object.values(recipients).forEach(([address, amount]) => {
      balanceTree.push({
        address,
        earnings: amount.toString(),
      })
    })
    return MerkleUtils.parseBalanceMap(balanceTree)
  }, [recipients])

  const onConfirm = async () => {
    if (!sdk || !account.isAddress(mintSelected) || !tree) return

    const { merkleRoot } = tree
    setLoading(true)
    try {
      const { splt, wallet } = window.sentre
      if (!wallet) throw Error('Please connect wallet')

      const maxTotalClaim = total.toString()
      const publicKey = account.fromAddress(mintSelected)

      const { tx, distributor, distributorATA } = await sdk.createDistributor({
        tokenMint: publicKey,
        root: merkleRoot,
        maxNumNodes: toU64(quantity),
        maxTotalClaim: toU64(maxTotalClaim),
      })
      const pendingTx = await tx.send()
      await pendingTx.wait()

      const distributorInfo = {
        distributor: distributor.toBase58(),
        distributorATA: distributorATA.toBase58(),
      }

      // Transfer token to DistributorATA
      const srcAddress = await splt.deriveAssociatedAddress(
        walletAddress,
        mintSelected,
      )

      const { txId: txIdTransfer } = await splt.transfer(
        BigInt(maxTotalClaim),
        srcAddress,
        distributorInfo.distributorATA,
        wallet,
      )
      window.notify({
        type: 'success',
        description: 'Transfer successfully. Click to view details.',
        onClick: () => window.open(explorer(txIdTransfer)),
      })

      /**Save history */
      const ipfs = new IPFS()
      const db = new PDB(walletAddress).createInstance('lightning_tunnel')

      const oldHistory: History[] = (await db.getItem('history')) || []
      const newHistory = [...oldHistory]
      const dataEncoded = encodeData(tree, distributorInfo, mintSelected)
      const cid = await ipfs.set(dataEncoded)

      const history: History = {
        cid,
        total: utils.undecimalize(total, mintDecimals),
        time: new Date().toString(),
        mint: mintSelected,
      }
      newHistory.push(history)
      db.setItem('history', newHistory)

      const redeemAt = `${window.location.origin}${appRoute}?${generateQuery({
        redeem: cid,
      })}`
      setRedeemLink(redeemAt)
      return setVisible(true)
    } catch (err: any) {
      window.notify({ type: 'error', description: err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBalanceAccount()
  }, [getBalanceAccount])

  return (
    <Card bordered={false} className="card-lightning">
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Header label="Confirm transfer" />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]} justify="center">
            <Col>
              <Space direction="vertical" size={12} align="center">
                <Typography.Text>Total transfer</Typography.Text>
                <Typography.Title level={1}>
                  {utils.undecimalize(total, mintDecimals)}
                </Typography.Title>
                <Tag
                  style={{
                    margin: 0,
                    borderRadius: 4,
                    color: 'rgb(66, 230, 235)',
                    background: 'rgba(66, 230, 235, 0.1)',
                    border: 'unset',
                  }}
                >
                  <MintSymbol mintAddress={mintSelected} />
                </Tag>
              </Space>
            </Col>
            <Col span={24}>
              <Card bordered={false} className="card-total">
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
                onClick={() => dispatch(onSelectStep(Step.two))}
                block
                type="ghost"
              >
                BACK
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                onClick={onConfirm}
                type="primary"
                loading={loading}
                block
              >
                TRANSFER
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <ModalShare
        visible={visible}
        setVisible={setVisible}
        redeemLink={redeemLink}
      />
    </Card>
  )
}

export default ConfirmTransfer