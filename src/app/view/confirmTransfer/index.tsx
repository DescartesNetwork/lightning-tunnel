import { useMemo, useState } from 'react'
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
import Content from './content'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'
import { explorer, numeric } from 'shared/util'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import useTotal from 'app/hooks/useTotal'
import useMerkleSDK from 'app/hooks/useMerkleSDK'
import { encodeData } from 'app/helper'
import IPFS from 'shared/pdb/ipfs'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import useRemainingBalance from 'app/hooks/useRemainingBalance'
import History, { HistoryRecord } from 'app/helper/history'
import configs from 'app/configs'
import { getHistory, setStateHistory } from 'app/model/history.controller'

const {
  manifest: { appId },
} = configs

const ConfirmTransfer = () => {
  const [loading, setLoading] = useState(false)
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
  const { balance } = useAccountBalanceByMintAddress(mintSelected)
  const remainingBalance = useRemainingBalance(mintSelected)

  const tree = useMemo(() => {
    if (!recipients.length || !mintDecimals) return
    const balanceTree: NewFormat[] = []
    Object.values(recipients).forEach(([address, amount]) => {
      balanceTree.push({
        address,
        earnings: isDecimal
          ? utils.decimalize(amount, mintDecimals).toString()
          : amount,
      })
    })
    return MerkleUtils.parseBalanceMap(balanceTree)
  }, [recipients, mintDecimals, isDecimal])

  const onConfirm = async () => {
    if (!sdk || !account.isAddress(mintSelected) || !tree) return

    setLoading(true)
    try {
      const { splt, wallet } = window.sentre
      if (!wallet) throw new Error('Please connect wallet')

      const { merkleRoot } = tree
      const maxTotalClaim = utils.decimalize(total, mintDecimals).toString()
      const mintPublicKey = account.fromAddress(mintSelected)

      // Init a distributor
      const { tx, distributor, distributorATA } = await sdk.createDistributor({
        tokenMint: mintPublicKey,
        root: merkleRoot,
        maxNumNodes: new u64(quantity),
        maxTotalClaim: new u64(maxTotalClaim),
      })
      const pendingTx = await tx.send()
      try {
        await pendingTx.wait()
      } catch (er: any) {
        return console.warn(er.message)
      }

      // Save data to local and IPFS
      const distributorInfo = {
        distributor: distributor.toBase58(),
        distributorATA: distributorATA.toBase58(),
      }
      const dataEncoded = encodeData(tree, distributorInfo, mintSelected)
      const ipfs = new IPFS()
      const cid = await ipfs.set(dataEncoded)
      const historyRecord: HistoryRecord = {
        cid,
        total,
        time: new Date().toString(),
        mint: mintSelected,
        state: 'IN_PROGRESS',
      }
      const history = new History('history', walletAddress)
      await history.append(historyRecord)
      await dispatch(getHistory(walletAddress)) // To realtime

      // Transfer token to the distributor
      const srcAddress = await splt.deriveAssociatedAddress(
        walletAddress,
        mintSelected,
      )
      const { txId } = await splt.transfer(
        BigInt(maxTotalClaim),
        srcAddress,
        distributorInfo.distributorATA,
        wallet,
      )
      window.notify({
        type: 'success',
        description: 'Transfer successfully. Click to view details.',
        onClick: () => window.open(explorer(txId), '_blank'),
      })

      //update state history
      await dispatch(setStateHistory({ cid, state: 'DONE', walletAddress }))

      // Generate redemption link
      return setRedeemLink(
        `${window.location.origin}/app/${appId}/redeem/${cid}?autoInstall=true`,
      )
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    } finally {
      return setLoading(false)
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
        visible={Boolean(redeemLink)}
        onClose={() => setRedeemLink('')}
        redeemLink={redeemLink}
      />
    </Card>
  )
}

export default ConfirmTransfer
