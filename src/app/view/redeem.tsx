import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { utils } from '@senswap/sen-js'
import { useMint, useWallet } from '@senhub/providers'
import {
  DistributorData,
  FeeOptions,
  Leaf,
  MerkleDistributor,
} from '@sentre/utility'

import { Image, Space, Typography, Row, Col, Button, Card } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { notifySuccess, notifyError, getCID } from 'app/helper'
import { MintSymbol } from 'shared/antd/mint'
import { useAppRouter } from 'app/hooks/useAppRoute'
import IPFS from 'shared/pdb/ipfs'
import configs from 'app/configs'

import REDEEM_IMG from 'app/static/images/redeem.svg'
import { BN } from 'bn.js'
import moment from 'moment'

const {
  sol: { utility, taxman, fee },
} = configs

const Redeem = () => {
  const [loading, setLoading] = useState(false)
  const [loadingCard, setLoadingCard] = useState(false)
  const [merkle, setMerkle] = useState<MerkleDistributor>()
  const [decimals, setDecimals] = useState<number>(0)
  const [distributor, setDistributor] = useState<DistributorData>()
  const [disabled, setDisabled] = useState(false)

  const { getDecimals } = useMint()

  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { pushHistory } = useAppRouter()
  const params = useParams<{ distributorAddress: string }>()

  const feeOptions: FeeOptions = {
    fee: new BN(fee),
    feeCollectorAddress: taxman,
  }

  const getMerkleDistributor = useCallback(async () => {
    if (!params.distributorAddress) return
    const ipfs = new IPFS()
    setLoadingCard(true)
    try {
      const distributor = await utility.program.account.distributor.fetch(
        params.distributorAddress,
      )
      setDistributor(distributor)

      const cid = await getCID(distributor.metadata)
      console.log(cid, 'cid')
      const data = await ipfs.get(cid)
      const merkleDistributor = MerkleDistributor.fromBuffer(Buffer.from(data))

      return setMerkle(merkleDistributor)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoadingCard(false)
    }
  }, [params.distributorAddress])

  const recipientData = useMemo(() => {
    if (!merkle) return
    const recipients = merkle.receipients as Leaf[]
    for (const recipient of recipients) {
      if (walletAddress === recipient.authority.toBase58()) return recipient
    }
    window.notify({
      type: 'warning',
      description: 'You are not in the list.',
    })

    return setDisabled(true)
  }, [merkle, walletAddress])

  const checkValid = useCallback(async () => {
    if (!distributor || !recipientData || !merkle) return
    try {
      const { salt } = recipientData
      const receiptAddress = await utility.deriveReceiptAddress(
        salt,
        params.distributorAddress,
      )
      const receiptData = await utility.getReceiptData(receiptAddress)
      if (!receiptData) return
      const claimedAt = receiptData.claimedAt.toNumber()
      window.notify({
        type: 'error',
        description: `You have claimed at ${moment(claimedAt * 1000).format(
          'DD/MM/YYYY HH:mm',
        )}`,
      })
      return setDisabled(true)
    } catch (error) {}
  }, [distributor, merkle, params.distributorAddress, recipientData])

  const onRedeem = async () => {
    if (!recipientData || !merkle) return
    const proof = merkle.deriveProof(recipientData)
    const validProof = merkle.verifyProof(proof, recipientData)
    if (!validProof) return

    try {
      setLoading(true)
      const { txId } = await utility.claim({
        distributorAddress: params.distributorAddress,
        proof,
        data: recipientData,
        feeOptions,
      })
      notifySuccess('Redeem', txId)
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
      const decimals = await getDecimals(mintAddress)
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
    checkValid()
  }, [checkValid])

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
              <Image src={REDEEM_IMG} preview={false} />
            </Col>
            <Col span={24}>
              <Space direction="vertical" size={4}>
                <Typography.Title level={3}>Redemption!</Typography.Title>
                <Space size={4}>
                  <Typography.Text type="secondary">Let's take</Typography.Text>{' '}
                  <Typography.Title level={5} style={{ color: '#42E6EB' }}>
                    {utils.undecimalize(
                      BigInt(recipientData?.amount.toNumber() || 0),
                      decimals,
                    )}{' '}
                    <MintSymbol
                      mintAddress={distributor?.mint.toBase58() || ''}
                    />
                  </Typography.Title>
                </Space>
              </Space>
            </Col>
            <Col span={24}>
              <Button
                disabled={disabled}
                type="primary"
                onClick={onRedeem}
                loading={loading}
              >
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
