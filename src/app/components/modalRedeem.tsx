import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
import { useWallet } from '@senhub/providers'
import { PublicKey } from '@solana/web3.js'
import { u64 } from '@saberhq/token-utils'
import { MerkleDistributorWrapper } from '@saberhq/merkle-distributor'

import { Modal, Image, Space, Typography, Row, Col, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { ClaimProof } from 'app/helper'
import { notifySuccess, notifyError } from 'app/helper'
import { AppDispatch } from 'app/model'
import { setVisible } from 'app/model/main.controller'
import useMerkleSDK from 'app/hooks/useMerkleSDK'

import REDEEM from 'app/static/images/redeem.svg'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { MintSymbol } from 'shared/antd/mint'

const ModalRedeem = ({
  visible,
  claimProof,
}: {
  visible: boolean
  claimProof?: ClaimProof
}) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const sdk = useMerkleSDK()
  const mintDecimals = useMintDecimals(claimProof?.mintAddress || '') || 0

  const fetchDistributor = useCallback(
    async (distributorAddr: string) => {
      if (!sdk) return

      const publicKey = account.fromAddress(distributorAddr)
      const distributorW = await MerkleDistributorWrapper.load(sdk, publicKey)

      return distributorW
    },
    [sdk],
  )

  const onClaim = useCallback(async () => {
    console.log(claimProof)
    if (!claimProof || !claimProof.distributorInfo) return

    const {
      index,
      amount,
      proof,
      claimant,
      distributorInfo: { distributor: distributorAddr },
    } = claimProof

    const distributor = await fetchDistributor(distributorAddr)

    if (
      claimant !== walletAddress ||
      !account.isAddress(distributorAddr) ||
      !distributor
    )
      return window.notify({ type: 'warning', description: 'Invalid proof' })
    setLoading(true)
    try {
      const { isClaimed } = await distributor.getClaimStatus(new u64(index))
      if (isClaimed)
        return window.notify({ type: 'error', description: 'You have clamied' })
    } catch (err) {}

    const bufferProof = !proof.length ? [] : [Buffer.from(proof[0].data)]

    const tx = await distributor.claim({
      index: new u64(index),
      amount: new u64(amount),
      proof: bufferProof,
      claimant: new PublicKey(walletAddress),
    })
    try {
      const { signature } = await tx.confirm()
      notifySuccess('Claim successfully', signature)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
      return dispatch(setVisible(false))
    }
  }, [claimProof, dispatch, fetchDistributor, walletAddress])

  return (
    <Modal
      visible={visible}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={() => dispatch(setVisible(false))}
      footer={null}
      className="card-lightning"
      style={{ paddingBottom: 0 }}
    >
      <Row gutter={[32, 32]} style={{ textAlign: 'center' }}>
        <Col span={24}>
          <Image src={REDEEM} preview={false} />
        </Col>
        <Col span={24}>
          <Space direction="vertical" size={4}>
            <Typography.Title level={3}>Redemption!</Typography.Title>
            <Space size={4}>
              <Typography.Text type="secondary">Let's take</Typography.Text>
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
    </Modal>
  )
}

export default ModalRedeem
