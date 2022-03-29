import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { Col, Row } from 'antd'
import ModalRedeem from 'app/components/modalRedeem'
import Container from './container'

import { AppDispatch, AppState } from 'app/model'
import { setVisible } from 'app/model/main.controller'
import { ClaimProof } from 'app/helper'
import { useWallet } from '@senhub/providers'
import IPFS from 'shared/pdb/ipfs'

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
  const cid = query.get('redeem')

  const canRedeem = useCallback(async () => {
    if (!cid) return
    const ipfs = new IPFS()
    const claimantData = await ipfs.get(cid)

    for (const claimant of Object.keys(claimantData)) {
      if (claimant === walletAddress) {
        setClaimProof(claimantData[claimant])
        return dispatch(setVisible(true))
      }
    }

    return window.notify({ type: 'warning', description: 'wrong wallet' })
  }, [cid, walletAddress, dispatch])

  useEffect(() => {
    canRedeem()
  }, [canRedeem])

  return (
    <Row gutter={[24, 24]} justify="center" className="lightning-container">
      <Col xs={24} md={16} lg={10}>
        <Container />
      </Col>
      <ModalRedeem visible={visible} claimProof={claimProof} />
    </Row>
  )
}

export default Page
