import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeOptions, Leaf, MerkleDistributor } from '@sentre/utility'
import { useWallet } from '@senhub/providers'
import { account, utils } from '@senswap/sen-js'
import { BN } from 'bn.js'
import { CID } from 'ipfs-core'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import Header from 'app/components/header'
import ModalShare from 'app/components/modalShare'
import { MintSymbol } from 'shared/antd/mint'
import ButtonHome from 'app/components/buttonHome'
import { WrapTotal } from 'app/components/cardTotal'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { Step } from 'app/constants'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import useTotal from 'app/hooks/useTotal'
import useRemainingBalance from 'app/hooks/useRemainingBalance'
import configs from 'app/configs'
import IPFS from 'shared/pdb/ipfs'
import History, { HistoryRecord } from 'app/helper/history'
import { getHistory } from 'app/model/history.controller'
import { notifySuccess } from 'app/helper'
import { onSelectMethod } from 'app/model/main.controller'
import { removeRecipients } from 'app/model/recipients.controller'
import { RecipientInfo } from 'app/model/recipientsV2.controller'

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
    recipients: { recipientInfos, globalUnlockTime, expirationTime },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const mintDecimals = useMintDecimals(mintSelected) || 0
  const { total } = useTotal()
  const remainingBalance = useRemainingBalance(mintSelected)

  const treeData = useMemo(() => {
    if (!recipientInfos || !mintDecimals) return
    const listRecipient: RecipientInfo[] = []
    for (const walletAddress in recipientInfos) {
      listRecipient.concat(recipientInfos[walletAddress])
    }
    const balanceTree: Leaf[] = listRecipient.map(
      ({ amount, address }, index) => {
        const actualAmount = isDecimal
          ? utils.decimalize(amount, mintDecimals).toString()
          : amount
        return {
          authority: account.fromAddress(address),
          amount: new BN(actualAmount),
          startedAt: new BN(globalUnlockTime / 1000),
          salt: MerkleDistributor.salt(
            `${appId}/${typeDistribute}/${index.toString()}`,
          ),
        }
      },
    )
    const merkleDistributor = new MerkleDistributor(balanceTree)
    const dataBuffer = merkleDistributor.toBuffer()
    return dataBuffer
  }, [
    recipientInfos,
    mintDecimals,
    isDecimal,
    globalUnlockTime,
    typeDistribute,
  ])

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

      const { txId, distributorAddress } = await utility.initializeDistributor({
        tokenAddress: mintSelected,
        total: merkleDistributor.getTotal(),
        merkleRoot: merkleDistributor.deriveMerkleRoot(),
        metadata,
        endedAt: expirationTime / 1000,
        feeOptions,
      })

      const historyRecord: HistoryRecord = {
        total: merkleDistributor.getTotal().toNumber(),
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
