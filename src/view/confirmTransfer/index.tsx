import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeeOptions, Leaf, MerkleDistributor } from '@sentre/utility'
import { account } from '@senswap/sen-js'
import { useMintDecimals } from '@sentre/senhub'
import { BN } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'
import { decode } from 'bs58'

import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import Header from 'components/header'
import ModalShare from 'components/modalShare'
import { MintSymbol } from '@sen-use/app'
import { WrapTotal } from 'components/cardTotal'

import useTotal from 'hooks/useTotal'
import useRemainingBalance from 'hooks/useRemainingBalance'
import { AppDispatch, AppState } from 'model'
import { onSelectStep } from 'model/steps.controller'
import { Step } from '../../constants'
import { toUnitTime, notifySuccess } from 'helper'
import { RecipientInfo } from 'model/recipients.controller'
import { useRedirectAndClear } from 'hooks/useRedirectAndClear'
import { uploadFileToAws } from 'helper/aws'

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
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const mintDecimals = useMintDecimals({ mintAddress: mintSelected }) || 0
  const { total } = useTotal()
  const remainingBalance = useRemainingBalance(mintSelected)
  const { onPushAndClear } = useRedirectAndClear()

  const treeData = useMemo(() => {
    if (!recipientInfos || mintDecimals === undefined) return
    let listRecipient: RecipientInfo[] = []
    for (const walletAddress in recipientInfos) {
      listRecipient = listRecipient.concat(recipientInfos[walletAddress])
    }
    const balanceTree: Leaf[] = listRecipient.map(
      ({ amount, address, unlockTime }, index) => {
        const unitTime = toUnitTime(unlockTime)
        const actualAmount = isDecimal
          ? utilsBN.decimalize(amount, mintDecimals)
          : new BN(amount)
        return {
          authority: account.fromAddress(address),
          amount: actualAmount,
          startedAt: new BN(unitTime / 1000),
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

      const data = {
        createAt: Math.floor(Date.now() / 1000),
        data: treeData,
      }
      const blob = [
        new Blob([JSON.stringify({ ...data }, null, 2)], {
          type: 'application/json',
        }),
      ]
      const file = new File(blob, 'metadata.txt')
      const cid = await uploadFileToAws(file)

      const { txId, distributorAddress } = await utility.initializeDistributor({
        tokenAddress: mintSelected,
        total: merkleDistributor.getTotal(),
        merkleRoot: merkleDistributor.deriveMerkleRoot(),
        metadata: decode(cid),
        endedAt: expirationTime / 1000,
        feeOptions,
      })

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
                    fontSize: 16,
                    padding: '4px 12px',
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
            <Button
              size="large"
              type="primary"
              block
              onClick={() => onPushAndClear(`/${typeDistribute}`)}
            >
              Home
            </Button>
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
