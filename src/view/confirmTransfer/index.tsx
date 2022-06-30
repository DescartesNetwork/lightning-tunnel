import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { FeeOptions, Leaf, MerkleDistributor } from '@sentre/utility'
import { useWallet } from '@sentre/senhub'
import { account, utils } from '@senswap/sen-js'
import { BN } from 'bn.js'
import { CID } from 'ipfs-core'
import { util } from '@sentre/senhub'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import Header from 'components/header'
import ModalShare from 'components/modalShare'
import { MintSymbol } from 'shared/antd/mint'
import Content from './content'

import { AppDispatch, AppState } from 'model'
import { onSelectStep } from 'model/steps.controller'
import { Step } from '../../constants'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import useTotal from 'hooks/useTotal'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import useRemainingBalance from 'hooks/useRemainingBalance'
import configs from 'configs'
import History, { HistoryRecord } from 'helper/history'
import { getHistory } from 'model/history.controller'
import { notifySuccess } from 'helper'
import ButtonHome from 'components/buttonHome'
import { onSelectMethod } from 'model/main.controller'
import { removeRecipients } from 'model/recipients.controller'
import IPFS from 'helper/ipfs'

const {
  sol: { utility, fee, taxman },
  manifest: { appId },
} = configs

const ONE_DAY = 24 * 60 * 60 * 1000
const ONE_MONTH = ONE_DAY * 30

const ConfirmTransfer = () => {
  const [loading, setLoading] = useState(false)
  const [redeemLink, setRedeemLink] = useState('')
  const [isDone, setIsDone] = useState(false)
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
  const { balance } = useAccountBalanceByMintAddress(mintSelected)
  const remainingBalance = useRemainingBalance(mintSelected)

  const treeData = useMemo(() => {
    if (!recipients.length || !mintDecimals) return
    const balanceTree: Leaf[] = recipients.map(([address, amount], index) => {
      const actualAmount = isDecimal
        ? utils.decimalize(amount, mintDecimals).toString()
        : amount
      return {
        authority: account.fromAddress(address),
        amount: new BN(actualAmount),
        startedAt: new BN(0),
        salt: MerkleDistributor.salt(`${appId}/airdrop/${index.toString()}`),
      }
    })
    const merkleDistributor = new MerkleDistributor(balanceTree)
    const dataBuffer = merkleDistributor.toBuffer()
    return dataBuffer
  }, [recipients, mintDecimals, isDecimal])

  const feeOptions: FeeOptions = {
    fee: new BN(fee),
    feeCollectorAddress: taxman,
  }

  const onConfirm = async () => {
    if (!treeData) return
    setLoading(true)
    try {
      const merkleDistributor = MerkleDistributor.fromBuffer(treeData)
      const ipfs = new IPFS()

      const cid = await ipfs.set(treeData.toJSON().data)
      const {
        multihash: { digest },
      } = CID.parse(cid)

      const metadata = Buffer.from(digest)
      const CURRENT_TIME = Date.now()

      const { txId, distributorAddress } = await utility.initializeDistributor({
        tokenAddress: mintSelected,
        total: merkleDistributor.getTotal(),
        merkleRoot: merkleDistributor.deriveMerkleRoot(),
        metadata,
        endedAt: Math.round((CURRENT_TIME + ONE_MONTH) / 1000),
        feeOptions,
      })

      const historyRecord: HistoryRecord = {
        total: merkleDistributor.getTotal().toString(),
        time: new Date().toString(),
        mint: mintSelected,
        distributorAddress,
        treeData,
      }
      const history = new History('history', walletAddress)
      await history.append(historyRecord)
      await dispatch(getHistory(walletAddress))

      setIsDone(true)

      notifySuccess('Airdrop', txId)
      return setRedeemLink(
        `${window.location.origin}/app/${appId}/redeem/${distributorAddress}?autoInstall=true`,
      )
    } catch (error: any) {
      window.notify({
        type: 'error',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const backToDashboard = useCallback(async () => {
    await dispatch(onSelectMethod())
    await dispatch(removeRecipients())
    dispatch(onSelectStep(Step.one))
  }, [dispatch])

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
                      value={moment(new Date()).format('DD MMM, YYYY HH:mm')}
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
                          {util.numeric(balance).format('0,0.00[0000]')}{' '}
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
                          {util.numeric(remainingBalance).format('0,0.00[00]')}{' '}
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
          {isDone ? (
            <ButtonHome onBack={backToDashboard} />
          ) : (
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
          )}
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