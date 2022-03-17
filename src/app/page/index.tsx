import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useWallet } from '@senhub/providers'

import { Col, Row } from 'antd'
import ModalRedeem from 'app/components/modalRedeem'
import StepPriFi from 'app/components/stepPriFi'
import Container from './container'

import { AppDispatch, AppState } from 'app/model'
import { setVisible } from 'app/model/main.controller'

const Page = () => {
  const { visible } = useSelector((state: AppState) => state.main)
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const query = new URLSearchParams(useLocation().search)
  const address = query.get('address')
  const redeem = query.get('redeem')

  const canRedeem = useCallback(() => {
    if (address !== walletAddress)
      return window.notify({ type: 'warning', description: 'Wrong wallet' })
    if (!redeem) return
    return dispatch(setVisible(true))
  }, [address, dispatch, redeem, walletAddress])

  useEffect(() => {
    canRedeem()
  }, [canRedeem])

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col span={5}>
        <StepPriFi />
      </Col>
      <Col span={10}>
        <Container />
      </Col>
      <Col span={5} /> {/** safe place */}
      <ModalRedeem visible={visible} />
    </Row>
  )
}

export default Page
