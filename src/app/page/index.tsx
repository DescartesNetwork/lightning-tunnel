import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import ModalRedeem from 'app/components/modalRedeem'
import StepPriFi from 'app/components/stepPriFi'
import Container from './container'

import { AppDispatch, AppState } from 'app/model'
import { setVisible } from 'app/model/main.controller'
import { useAppRouter } from 'app/hooks/useAppRoute'
import { notifyError, notifySuccess } from 'app/helper'

const Page = () => {
  const { visible } = useSelector((state: AppState) => state.main)
  const dispatch = useDispatch<AppDispatch>()
  const { getQuery, pushHistory } = useAppRouter()
  const transferData = getQuery('transferData')
  const signature = getQuery('signature')
  const recoveryId = getQuery('recoveryId')

  const redeem = useCallback(async () => {
    if (!transferData || !signature || !recoveryId) return
    try {
      const { txId } = await window.lightningTunnel.redeem({
        transferData,
        signature,
        recoveryId: Number(recoveryId),
      })
      pushHistory('')
      notifySuccess('Redeem', txId)
      return dispatch(setVisible(true))
    } catch (error) {
      notifyError(error)
    }
  }, [dispatch, pushHistory, recoveryId, signature, transferData])

  useEffect(() => {
    redeem()
  }, [redeem])

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} lg={5}>
        <StepPriFi />
      </Col>
      <Col xs={24} md={16} lg={10}>
        <Container />
      </Col>
      <Col xs={0} lg={5} /> {/** safe place */}
      <ModalRedeem visible={visible} />
    </Row>
  )
}

export default Page
