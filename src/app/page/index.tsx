import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useWallet } from '@senhub/providers'
import { Provider, web3 } from '@project-serum/anchor'
import { SolanaProvider } from '@saberhq/solana-contrib'
import { account, WalletInterface } from '@senswap/sen-js'
import { u64 } from '@saberhq/token-utils'

import { Button, Col, Row } from 'antd'
import ModalRedeem from 'app/components/modalRedeem'
import StepPriFi from 'app/components/stepPriFi'
import Container from './container'

import { AppDispatch, AppState } from 'app/model'
import { setVisible } from 'app/model/main.controller'
import {
  MerkleDistributorSDK,
  MerkleDistributorWrapper,
} from '@saberhq/merkle-distributor'
import configs from 'app/configs'
import { PublicKey } from '@solana/web3.js'
import { notifySuccess, notifyError } from 'app/helper'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'

const {
  sol: { node },
} = configs

type ClaimProof = {
  index: number
  amount: string
  proof: any
  clamaint: string
}

export const getAnchorProvider = (
  node: string,
  walletAddress: string,
  wallet: WalletInterface,
): Provider => {
  const connection = new web3.Connection(node, 'confirmed')

  const signAllTransactions = async (transactions: web3.Transaction[]) => {
    const signedTransactions = []
    for (const transaction of transactions) {
      const signedTransaction = await wallet.signTransaction(transaction)
      signedTransactions.push(signedTransaction)
    }
    return signedTransactions
  }

  const publicKey = new web3.PublicKey(walletAddress)
  return new Provider(
    connection,
    {
      publicKey: new web3.PublicKey(publicKey),
      signTransaction: wallet.signTransaction,
      signAllTransactions,
    },
    {
      commitment: 'confirmed',
      skipPreflight: true,
    },
  )
}

export const createSDK = async () => {
  const { wallet } = window.sentre
  if (!wallet) return
  const walletAddress = await wallet.getAddress()
  const anchorProvider = getAnchorProvider(node, walletAddress, wallet)
  const provider = SolanaProvider.init({
    connection: anchorProvider.connection,
    wallet: anchorProvider.wallet,
    opts: anchorProvider.opts,
  })

  return MerkleDistributorSDK.load({ provider })
}

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [claimProof, setClaimProof] = useState<ClaimProof>()
  const {
    main: { visible },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const query = new URLSearchParams(useLocation().search)
  const address = query.get('address')
  const redeem = query.get('redeem')

  const canRedeem = useCallback(() => {
    if (!address || !redeem) return
    if (address !== walletAddress)
      return window.notify({ type: 'warning', description: 'Wrong wallet' })
    return dispatch(setVisible(true))
  }, [address, dispatch, redeem, walletAddress])

  useEffect(() => {
    canRedeem()
  }, [canRedeem])

  const fecthDistributor = useCallback(async () => {
    const sdk = await createSDK()
    if (!sdk) return
    const publicKey = account.fromAddress(
      '3wWZRvrSoP4BugfC9k5gcFFkSMvyfmJdbsiYPRPqEJxs',
    )

    const distributorW = await MerkleDistributorWrapper.load(sdk, publicKey)

    return distributorW
  }, [])

  const onClaim = useCallback(async () => {
    const distributor = await fecthDistributor()
    if (!distributor || !claimProof) return
    setLoading(true)

    const { index, amount, proof, clamaint } = claimProof
    if (clamaint !== walletAddress)
      return window.notify({ type: 'warning', description: 'Wrong wallet' })

    try {
      const { isClaimed } = await distributor.getClaimStatus(new u64(index))
      if (isClaimed)
        return window.notify({ type: 'error', description: 'You have clamied' })
    } catch (err) {}

    const bufferProof = Buffer.from(proof[0].data)
    const tx = await distributor.claim({
      index: new u64(index),
      amount: new u64(amount),
      proof: [bufferProof],
      claimant: new PublicKey(walletAddress),
    })
    try {
      const { signature } = await tx.confirm()
      return notifySuccess('Claim successfully', signature)
    } catch (err) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }, [claimProof, fecthDistributor, walletAddress])

  const decryptData = () => {
    const data = bs58.decode(
      '3NDKTebFSLAJBVfeBV21UTvwcK4WSjoMByr941fqQQZUDpB5Qw4LMuJEn1rhyxvWcvBrjWTbDqHKhmY5FEKWKvfN3Lqq1tTGBgY1V9HjCuu5cvCKkncq5JN7vaGusJdgjs3q16hBeLKGWrMFPZhYH3E2PXgnHYRFSEvEmHH8n6eTkRXva6PV2kBTKztLxERDBiufFDnj8N3HaY6kY1XtWdum6qJpBtHggGHuyg3VDyT8USBCXFbJAas4xyTMYHuvKiGwG4zfk9fthrvweuqAHwWzW7Pmps5nLpWQ8s6xrsnxFD51hV6F3JBT9iYFXjpicqbgycx',
    )
    const tmp = new Buffer(data).toString()
    console.log(JSON.parse(tmp))
    setClaimProof(JSON.parse(tmp))
  }

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} lg={5}>
        <StepPriFi />
      </Col>
      <Col xs={24} md={16} lg={10}>
        <Container />
      </Col>
      <Col xs={0} lg={5} /> {/** safe place */}
      <Col span={24}>
        <Button onClick={onClaim} loading={loading}>
          Claim
        </Button>
      </Col>
      <Col span={24}>
        <Button onClick={decryptData}>decryptData</Button>
      </Col>
      <ModalRedeem visible={visible} />
    </Row>
  )
}

export default Page
