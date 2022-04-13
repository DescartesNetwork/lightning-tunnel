import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { account, utils } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'
import { PublicKey } from '@solana/web3.js'
import { u64 } from '@saberhq/token-utils'
import { MerkleDistributorWrapper } from '@saberhq/merkle-distributor'

import { Image, Space, Typography, Row, Col, Button, Card } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { ClaimProof } from 'app/helper'
import { notifySuccess, notifyError } from 'app/helper'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { MintSymbol } from 'shared/antd/mint'
import { useAppRouter } from 'app/hooks/useAppRoute'
import IPFS from 'shared/pdb/ipfs'
import useMerkleSDK from 'app/hooks/useMerkleSDK'

import REDEEM from 'app/static/images/redeem.svg'

const Redeem = () => {
  const [loading, setLoading] = useState(false)
  const [loadingCard, setLoadingCard] = useState(false)
  const [claimProof, setClaimProof] = useState<ClaimProof>()

  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const sdk = useMerkleSDK()
  const { pushHistory } = useAppRouter()
  const mintDecimals = useMintDecimals(claimProof?.mintAddress || '') || 0
  const params: { cid: string } = useParams()

  const canRedeem = useCallback(async () => {
    if (!params.cid) return
    setLoadingCard(true)

    const ipfs = new IPFS()

    try {
      const claimantData = await ipfs.get(params.cid)
      for (const claimant of Object.keys(claimantData)) {
        if (claimant === walletAddress)
          return setClaimProof(claimantData[claimant])
      }

      return window.notify({
        type: 'warning',
        description: 'You are not in the list.',
      })
    } catch (err) {
      return window.notify({
        type: 'error',
        description: 'Redeem code not found',
      })
    } finally {
      return setLoadingCard(false)
    }
  }, [params.cid, walletAddress])

  const fetchDistributor = useCallback(
    async (distributorAddr: string) => {
      if (!sdk) return

      const publicKey = account.fromAddress(distributorAddr)
      const distributorW = await MerkleDistributorWrapper.load(sdk, publicKey)

      return distributorW
    },
    [sdk],
  )

  const bufferProof: Buffer[] = useMemo(() => {
    const buffProof: Buffer[] = []

    if (!claimProof?.proof) return buffProof
    const { proof } = claimProof

    proof.forEach(({ data }: any) => {
      buffProof.push(Buffer.from(data))
    })

    return buffProof
  }, [claimProof])

  const onClaim = useCallback(async () => {
    if (!claimProof || !claimProof.distributorInfo) return
    setLoading(true)

    const {
      index,
      amount,
      distributorInfo: { distributor: distributorAddr },
    } = claimProof

    const distributor = await fetchDistributor(distributorAddr)

    if (!account.isAddress(distributorAddr) || !distributor)
      return window.notify({
        type: 'error',
        description: 'Distributor does not exist',
      })

    try {
      const { isClaimed } = await distributor.getClaimStatus(new u64(index))
      if (isClaimed) {
        setLoading(false)
        return window.notify({
          type: 'error',
          description: 'Tokens has been redeemed',
        })
      }
    } catch (err) {}

    try {
      const tx = await distributor.claim({
        index: new u64(index),
        amount: new u64(amount),
        proof: bufferProof,
        claimant: new PublicKey(walletAddress),
      })
      const {
        signature,
        response: { meta },
      } = await tx.confirm()

      if (meta?.err)
        return window.notify({
          type: 'error',
          description: 'Something went wrong',
        })

      return notifySuccess('Claim', signature)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }, [bufferProof, claimProof, fetchDistributor, walletAddress])

  useEffect(() => {
    canRedeem()
  }, [canRedeem])

  return (
    <Row gutter={[24, 24]} justify="center" className="lightning-container">
      <Col xs={24} md={16} lg={12} xl={10}>
        <Card
          style={{ minHeight: 430 }}
          loading={loadingCard}
          className="card-lightning"
          bordered={false}
        >
          <Row gutter={[32, 32]} style={{ textAlign: 'center' }}>
            <Col span={24} style={{ textAlign: 'left' }}>
              <Button
                type="text"
                icon={<IonIcon name="arrow-back-outline" />}
                onClick={() => pushHistory('')}
                style={{ margin: -12 }}
              >
                Back
              </Button>
            </Col>
            <Col span={24}>
              <Image src={REDEEM} preview={false} />
            </Col>
            <Col span={24}>
              <Space direction="vertical" size={4}>
                <Typography.Title level={3}>Redemption!</Typography.Title>
                <Space size={4}>
                  <Typography.Text type="secondary">Let's take</Typography.Text>{' '}
                  <Typography.Title level={5} style={{ color: '#42E6EB' }}>
                    {utils.undecimalize(
                      BigInt(claimProof?.amount || 0),
                      mintDecimals,
                    )}{' '}
                    <MintSymbol mintAddress={claimProof?.mintAddress || ''} />
                  </Typography.Title>
                </Space>
              </Space>
            </Col>
            <Col span={24}>
              <Button type="primary" onClick={onClaim} loading={loading}>
                Redeem
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Redeem
