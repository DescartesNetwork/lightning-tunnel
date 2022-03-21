import { useCallback, useEffect, useState } from 'react'
import { BN } from '@project-serum/anchor'

import { Col, Row } from 'antd'
import ModalRedeem from 'app/components/modalRedeem'
import StepPriFi from 'app/components/stepPriFi'
import Container from './container'

import { useAppRouter } from 'app/hooks/useAppRoute'
import { notifyError, notifySuccess } from 'app/helper'

const Page = () => {
  const [redeemData, setRedeemData] = useState<{
    amount: BN
    mint: string
    visible: boolean
  }>({
    visible: false,
    amount: new BN(0),
    mint: '',
  })
  const { getQuery, pushHistory } = useAppRouter()
  const transferData = getQuery('transferData')
  const signature = getQuery('signature')
  const recoveryId = getQuery('recoveryId')

  const redeem = useCallback(async () => {
    if (!transferData || !signature || !recoveryId) return
    try {
      const { vault } = await window.lightningTunnel.parseTransferData(
        transferData,
      )
      const vaultData = await window.lightningTunnel.getVaultData(vault)
      const cert = await window.lightningTunnel.deriveCertAddress(vault)
      let prevAmount = new BN(0)
      try {
        const prevCertData = await window.lightningTunnel.getCertData(cert)
        prevAmount = prevCertData.amount
      } catch (error) {}

      const { txId } = await window.lightningTunnel.redeem({
        transferData,
        signature,
        recoveryId: Number(recoveryId),
      })
      pushHistory('')
      notifySuccess('Redeem', txId)
      const postCertData = await window.lightningTunnel.getCertData(cert)
      setRedeemData({
        visible: true,
        amount: postCertData.amount.sub(prevAmount),
        mint: vaultData.mint.toBase58(),
      })
    } catch (error) {
      notifyError(error)
    }
  }, [pushHistory, recoveryId, signature, transferData])

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
      <ModalRedeem {...redeemData} />
    </Row>
  )
}

export default Page
