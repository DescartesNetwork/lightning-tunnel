import { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useUI } from '@senhub/providers'

import { Col, Row } from 'antd'
import Container from './container'
import Redeem from './redeem'

import BG from 'app/static/images/background-LT.png'
import { useAppRouter } from 'app/hooks/useAppRoute'

const LightningTunnelHome = () => {
  return (
    <Row gutter={[24, 24]} justify="center" className="lightning-container">
      <Col xs={24} md={16} lg={12} xl={10}>
        <Container />
      </Col>
    </Row>
  )
}

const View = () => {
  const { appRoute } = useAppRouter()
  const { setBackground } = useUI()

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  return (
    <Switch>
      <Route exact path={appRoute} component={LightningTunnelHome} />
      <Route
        path={`${appRoute}/redeem/:distributorAddress`}
        component={Redeem}
      />
    </Switch>
  )
}

export default View
