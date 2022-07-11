import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeOptions, Leaf, MerkleDistributor } from '@sentre/utility'
import { useWallet } from '@sentre/senhub'
import { account, utils } from '@senswap/sen-js'
import { BN } from 'bn.js'
import { CID } from 'multiformats/cid'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import Header from 'components/header'
import ModalShare from 'components/modalShare'
import { MintSymbol } from 'shared/antd/mint'
import ButtonHome from 'components/buttonHome'
import { WrapTotal } from 'components/cardTotal'

import { useAppRouter } from 'hooks/useAppRoute'
import useTotal from 'hooks/useTotal'
import useRemainingBalance from 'hooks/useRemainingBalance'
import { AppDispatch, AppState } from 'model'
import { getHistory } from 'model/history.controller'
import { onSelectStep } from 'model/steps.controller'
import {
  setAdvancedMode,
  setListUnlockTime,
} from 'model/advancedMode.controller'
import { Step } from '../../constants'
import History, { HistoryRecord } from 'helper/history'
import { notifySuccess } from 'helper'
import IPFS from 'helper/ipfs'
import {
  RecipientInfo,
  removeRecipients,
  setExpiration,
  setGlobalUnlockTime,
} from 'model/recipients.controller'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import configs from 'configs'

const {
  sol: { utility, fee, taxman },
  manifest: { appId },
} = configs

const ConfirmTransfer = () => {
  const [loading, setLoading] = useState(false)
  const [redeemLink, setRedeemLink] = useState('')
  const [isDone, setIsDone] = useState(false)
  const {
    main: { mintSelected, typeDistribute },
    setting: { decimal: isDecimal },
    recipients: { recipientInfos, expirationTime },
    distributors,
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const { total } = useTotal()
  const remainingBalance = useRemainingBalance(mintSelected)
  const { pushHistory } = useAppRouter()

  const treeData = useMemo(() => {
    if (!recipientInfos || !mintDecimals) return
    let listRecipient: RecipientInfo[] = []
    for (const walletAddress in recipientInfos) {
      listRecipient = listRecipient.concat(recipientInfos[walletAddress])
    }
    const balanceTree: Leaf[] = listRecipient.map(
      ({ amount, address, unlockTime }, index) => {
        const actualAmount = isDecimal
          ? utils.decimalize(amount, mintDecimals).toString()
          : amount
        return {
          authority: account.fromAddress(address),
          amount: new BN(actualAmount),
          startedAt: new BN(unlockTime / 1000),
          salt: MerkleDistributor.salt(
            `${appId}/${typeDistribute}/${index.toString()}`,
          ),
        }
      },
    )
    const merkleDistributor = new MerkleDistributor(balanceTree)
    const dataBuffer = merkleDistributor.toBuffer()
    return dataBuffer
  }, [recipientInfos, mintDecimals, isDecimal, typeDistribute])

  const feeOptions: FeeOptions = {
    fee: new BN(fee),
    feeCollectorAddress: taxman,
  }

  const onConfirm = async () => {
    try {
      if (!treeData) throw new Error('Invalid Merkle Data')
      setLoading(true)
      const merkleDistributor = MerkleDistributor.fromBuffer(treeData)
      const ipfs = new IPFS()

      const cid = await ipfs.set(treeData.toJSON().data)
      const {
        multihash: { digest },
      } = CID.parse(cid)

      const metadata = Buffer.from(digest)

      const { txId, distributorAddress } = await utility.initializeDistributor({
        tokenAddress: mintSelected,
        total: merkleDistributor.getTotal(),
        merkleRoot: merkleDistributor.deriveMerkleRoot(),
        metadata,
        endedAt: expirationTime / 1000,
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
      await dispatch(getHistory({ walletAddress, distributors }))
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
    await dispatch(onSelectStep(Step.SelectMethod))
    await dispatch(removeRecipients())
    await dispatch(onSelectStep(Step.SelectMethod))
    await dispatch(setGlobalUnlockTime(0))
    await dispatch(setExpiration(0))
    await dispatch(setAdvancedMode(false))
    await dispatch(setListUnlockTime([]))
    return pushHistory(`/${typeDistribute}`)
  }, [dispatch, pushHistory, typeDistribute])

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
                <WrapTotal isConfirm={true} />
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
                  onClick={() => dispatch(onSelectStep(Step.AddRecipient))}
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
