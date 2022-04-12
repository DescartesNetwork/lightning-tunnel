import { ReactNode, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useWallet } from '@senhub/providers'
import { account, utils } from '@senswap/sen-js'
import { NewFormat } from '@saberhq/merkle-distributor/dist/cjs/utils'
import { u64 } from '@saberhq/token-utils'
import { utils as MerkleUtils } from '@saberhq/merkle-distributor'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import Header from 'app/components/header'
import ModalShare from 'app/components/modalShare'
import { MintSymbol } from 'shared/antd/mint'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { History, Step } from 'app/constants'
import { explorer, numeric } from 'shared/util'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import useTotal from 'app/hooks/useTotal'
import useMerkleSDK from 'app/hooks/useMerkleSDK'
import { encodeData } from 'app/helper'
import { useAppRouter } from 'app/hooks/useAppRoute'
import PDB from 'shared/pdb'
import IPFS from 'shared/pdb/ipfs'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import { setCurrentHistory } from 'app/model/main.controller'
import useRemainingBalance from 'app/hooks/useRemainingBalance'

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
  const [visible, setVisible] = useState(false)
  const [redeemLink, setRedeemLink] = useState('')
  const {
    main: { mintSelected },
    setting: { decimal: isDecimal },
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const { total, quantity } = useTotal()
  const sdk = useMerkleSDK()
  const { appRoute, generateQuery } = useAppRouter()
  const { balance } = useAccountBalanceByMintAddress(mintSelected)
  const remainingBalance = useRemainingBalance(mintSelected)

  const tree = useMemo(() => {
    if (!recipients.length || !mintDecimals) return
    const balanceTree: NewFormat[] = []
    Object.values(recipients).forEach(([address, amount]) => {
      balanceTree.push({
        address,
        earnings: isDecimal
          ? (Number(amount) * 10 ** mintDecimals).toString()
          : amount,
      })
    })
    return MerkleUtils.parseBalanceMap(balanceTree)
  }, [recipients, mintDecimals, isDecimal])

  const onConfirm = async () => {
    if (!sdk || !account.isAddress(mintSelected) || !tree) return

    const { merkleRoot } = tree
    setLoading(true)
    try {
      const { splt, wallet } = window.sentre
      if (!wallet) throw Error('Please connect wallet')

      const maxTotalClaim = utils.decimalize(total, mintDecimals).toString()
      const accountAddress = account.fromAddress(mintSelected)

      const { tx, distributor, distributorATA } = await sdk.createDistributor({
        tokenMint: accountAddress,
        root: merkleRoot,
        maxNumNodes: new u64(quantity),
        maxTotalClaim: new u64(maxTotalClaim),
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
        total,
        time: new Date().toString(),
        mint: mintSelected,
      }
      newHistory.unshift(history)
      dispatch(setCurrentHistory(history))
      db.setItem('history', newHistory)

      const redeemAt = `${
        window.location.origin
      }${appRoute}/redeem/${cid}?${generateQuery({ autoInstall: 'true' })}`

      setRedeemLink(redeemAt)
      return setVisible(true)
    } catch (err: any) {
      window.notify({ type: 'error', description: err.message })
    } finally {
      setLoading(false)
    }
  }

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
                <Typography.Title level={1}>{total}</Typography.Title>
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
                disabled={remainingBalance < 0}
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
