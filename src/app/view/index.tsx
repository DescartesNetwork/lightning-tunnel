import { useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useUI, useWallet } from '@senhub/providers'

import { Col, Drawer, Layout, Row } from 'antd'
import Redeem from './redeem'
import SideBar from './sideBar'
import Dashboard from './dashboard'
import Vesting from './vesting'
import Airdrop from './airdrop'
import AddNewAirdrop from './airdrop/addNewAirdrop'
import DistributorWatcher from 'app/watcher/distributor.watcher'

import { useAppRouter } from 'app/hooks/useAppRoute'
import { AppDispatch } from 'app/model'
import { getHistory } from 'app/model/history.controller'


import BG from 'app/static/images/background-LT.png'

import './index.less'

const { Content } = Layout

const View = () => {
  const { appRoute } = useAppRouter()
  const { setBackground } = useUI()
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walettAddress },
  } = useWallet()

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  useEffect(() => {
    dispatch(getHistory(walettAddress))
  }, [dispatch, walettAddress])

  return (
    <Layout className="main-layout">
      <Drawer placement="left" className="sidebar" mask={false} visible={true}>
        <SideBar />
      </Drawer>
      <Layout>
        <Content>
          <Row justify="center">
            <Col span={24} xxl={16}>
              <Switch>
                <Route
                  exact
                  path={`${appRoute}/dashboard`}
                  component={Dashboard}
                />
                <Route exact path={`${appRoute}/vesting`} component={Vesting} />
                <Route
                  exact
                  path={`${appRoute}/airdrop/add-new`}
                  component={AddNewAirdrop}
                />
                <Route exact path={`${appRoute}/airdrop`} component={Airdrop} />
                <Route
                  path={`${appRoute}/redeem/:distributorAddress`}
                  component={Redeem}
                />
                <Redirect from={appRoute} to={`${appRoute}/dashboard`} />
              </Switch>
            </Col>
          </Row>
        </Content>
        <DistributorWatcher />
      </Layout>
    </Layout>
  )
}

export default View
