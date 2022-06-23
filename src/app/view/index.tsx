import { useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useUI } from '@senhub/providers'

import { Drawer, Layout } from 'antd'
import Redeem from './redeem'
import SideBar from './sideBar'
import Dashboard from './dashboard'
import Vesting from './vesting'
import Airdrop from './airdrop'
import AddNewAirdrop from './airdrop/addNewAirdrop'
import AddNewVesting from './vesting/addNewVesting'
import HistoryWatcher from 'app/watcher/history.watcher'
import DistributorWatcher from 'app/watcher/distributor.watcher'

import { useAppRouter } from 'app/hooks/useAppRoute'

import BG from 'app/static/images/background-LT.png'

import './index.less'

const { Content } = Layout

const View = () => {
  const { appRoute } = useAppRouter()
  const { setBackground } = useUI()

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  return (
    <Layout className="main-layout">
      <Drawer placement="left" className="sidebar" mask={false} visible={true}>
        <SideBar />
      </Drawer>
      <Layout>
        <Content>
          <Switch>
            <Route exact path={`${appRoute}/dashboard`} component={Dashboard} />
            <Route exact path={`${appRoute}/vesting`} component={Vesting} />
            <Route
              exact
              path={`${appRoute}/vesting/add-new`}
              component={AddNewVesting}
            />
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
        </Content>
        <DistributorWatcher />
        <HistoryWatcher />
      </Layout>
    </Layout>
  )
}

export default View
