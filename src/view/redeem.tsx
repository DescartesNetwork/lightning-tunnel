import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import { useGetMintDecimals, useWalletAddress } from '@sentre/senhub'
import { DistributorData, FeeOptions, MerkleDistributor } from '@sentre/utility'
import { BN } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'

import { Image, Space, Typography, Row, Col, Button, Card } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintSymbol } from '@sen-use/app'

import { notifySuccess, notifyError } from 'helper'
import { useAppRouter } from 'hooks/useAppRoute'
import { useRedirectAndClear } from 'hooks/useRedirectAndClear'
import { useGetMetadata } from 'hooks/metadata/useGetMetadata'
import { AppState } from 'model'
import configs from 'configs'

import REDEEM_IMG from 'static/images/redeem.svg'
import REDEEM_SUCCESS from 'static/images/redeem_success.svg'
import NOT_MEMBER from 'static/images/not_member.svg'

const {
  sol: { utility, taxman, fee },
} = configs

const Redeem = () => {
  const [loading, setLoading] = useState(false)
  const [loadingCard, setLoadingCard] = useState(false)
  const [merkle, setMerkle] = useState<MerkleDistributor>()
  const [decimals, setDecimals] = useState<number>(0)
  const [distributor, setDistributor] = useState<DistributorData>()
  const [isValid, setIsValid] = useState(true)
  const [isMember, setIsMember] = useState(true)
  const [amountTaken, setAmountTaken] = useState('')
  const receipts = useSelector((state: AppState) => state.receipts)

  const getDecimals = useGetMintDecimals()
  const walletAddress = useWalletAddress()
  const { pushHistory } = useAppRouter()
  const { onPushAndClear } = useRedirectAndClear()
  const getMetaData = useGetMetadata()
  const params = useParams<{ distributorAddress: string }>()
  const distributorAddress = params.distributorAddress

  const feeOptions: FeeOptions = {
    fee: new BN(fee),
    feeCollectorAddress: taxman,
  }

  const getMerkleDistributor = useCallback(async () => {
    if (!distributorAddress) return
    setLoadingCard(true)
    try {
      const distributor = await utility.program.account.distributor.fetch(
        distributorAddress,
      )
      setDistributor(distributor)
      const { data } = getMetaData(distributorAddress)
      const merkleDistributor = MerkleDistributor.fromBuffer(Buffer.from(data))

      return setMerkle(merkleDistributor)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoadingCard(false)
    }
  }, [distributorAddress, getMetaData])

  const recipientData = useMemo(() => {
    if (!merkle) return
    const recipients = merkle.receipients
    for (const recipient of recipients) {
      if (walletAddress === recipient.authority.toBase58()) return recipient
    }
    setIsMember(false)
    return setIsValid(false)
  }, [merkle, walletAddress])

  const fetchRecipientData = useCallback(async () => {
    if (!distributor || !recipientData || !merkle) return
    try {
      const { salt } = recipientData
      const receiptAddress = await utility.deriveReceiptAddress(
        salt,
        distributorAddress,
      )
      const receiptData = receipts[receiptAddress]
      if (!receiptData) return
      const { amount } = receiptData
      setAmountTaken(utilsBN.undecimalize(amount, decimals))
      return setIsValid(false)
    } catch (error) {}
  }, [
    decimals,
    distributor,
    distributorAddress,
    merkle,
    receipts,
    recipientData,
  ])

  const onRedeem = async () => {
    if (!recipientData || !merkle) return
    const proof = merkle.deriveProof(recipientData)
    const validProof = merkle.verifyProof(proof, recipientData)
    if (!validProof) return

    try {
      setLoading(true)
      const { txId } = await utility.claim({
        distributorAddress,
        proof,
        data: recipientData,
        feeOptions,
      })
      notifySuccess('Redeem', txId)
      return setIsValid(false)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDecimals = useCallback(async () => {
    if (!distributor) return
    const mintAddress = distributor.mint.toBase58()
    try {
      const decimals = (await getDecimals({ mintAddress })) || 0
      return setDecimals(decimals)
    } catch (er: any) {
      return setDecimals(0)
    }
  }, [distributor, getDecimals])

  useEffect(() => {
    fetchDecimals()
  }, [fetchDecimals])

  useEffect(() => {
    getMerkleDistributor()
  }, [getMerkleDistributor])

  useEffect(() => {
    fetchRecipientData()
  }, [fetchRecipientData])

  const img = useMemo(() => {
    if (!isMember) return NOT_MEMBER
    if (amountTaken) return REDEEM_SUCCESS
    return REDEEM_IMG
  }, [amountTaken, isMember])

  return (
    <Row gutter={[24, 24]} justify="center" className="lightning-container">
      <Col xs={24} md={16} lg={14}>
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
              <Image src={img} preview={false} />
            </Col>
            <Col span={24}>
              {isMember ? (
                <Space direction="vertical" size={4}>
                  <Typography.Title level={3}>
                    Redemption {amountTaken && 'successfully'}!
                  </Typography.Title>
                  <Space size={4}>
                    <Typography.Text type="secondary">
                      {amountTaken ? 'You took' : "Let's take"}
                    </Typography.Text>
                    <Typography.Title level={5} style={{ color: '#42E6EB' }}>
                      {utils.undecimalize(
                        BigInt(recipientData?.amount.toString() || 0),
                        decimals,
                      )}{' '}
                      <MintSymbol
                        mintAddress={distributor?.mint.toBase58() || ''}
                      />
                    </Typography.Title>
                  </Space>
                </Space>
              ) : (
                <Typography.Title level={3}>
                  You are not in the list!
                </Typography.Title>
              )}
            </Col>
            <Col span={24}>
              {!isValid ? (
                <Button
                  size="large"
                  type="primary"
                  block
                  onClick={() => onPushAndClear('')}
                >
                  Home
                </Button>
              ) : (
                <Button type="primary" onClick={onRedeem} loading={loading}>
                  Redeem
                </Button>
              )}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Redeem
