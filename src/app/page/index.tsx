import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { Col, Row } from 'antd'
import ModalRedeem from 'app/components/modalRedeem'
import StepPriFi from 'app/components/stepPriFi'
import Container from './container'

import { AppDispatch, AppState } from 'app/model'
import { setVisible } from 'app/model/main.controller'
import { decodeData } from 'app/helper'
import { useWallet } from '@senhub/providers'

type ClaimProof = {
  index: number
  amount: string
  proof: any
  claimant: string
}

const Page = () => {
  const [claimProof, setClaimProof] = useState<ClaimProof>()
  const {
    main: { visible },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()
  const query = new URLSearchParams(useLocation().search)
  const claimData = query.get('redeem')

  const canRedeem = useCallback(() => {
    if (!claimData) return

    const proofData = decodeData(claimData)

    if (proofData?.claimant !== walletAddress)
      return window.notify({ type: 'warning', description: 'Wrong proof' })

    console.log(
      proofData.distributorInfo?.distributorATA,
      ' associated token address',
    )
    setClaimProof(proofData)
    return dispatch(setVisible(true))
  }, [dispatch, claimData, walletAddress])

  useEffect(() => {
    canRedeem()
  }, [canRedeem])

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} lg={5}>
        <StepPriFi />
      </Col>
      <Col xs={24} md={16} lg={10}>
        <Container />
      </Col>
      <Col xs={0} lg={5} /> {/** safe place */}
      <ModalRedeem visible={visible} claimProof={claimProof} />
    </Row>
  )
}

export default Page
