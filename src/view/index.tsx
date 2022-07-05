import { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useUI } from '@sentre/senhub'

import { Button, Col, Drawer, Layout, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Redeem from './redeem'
import SideBar from './sideBar'
import Dashboard from './dashboard'
import Vesting from './vesting'
import Airdrop from './airdrop'
import AddNewAirdrop from './airdrop/addNewAirdrop'
import AddNewVesting from './vesting/addNewVesting'
import HistoryWatcher from 'watcher/history.watcher'
import DistributorWatcher from 'watcher/distributor.watcher'
import ReceiptWatcher from 'watcher/receipt.watcher'
import ListReceivedWatcher from 'watcher/listReceived.watcher'

import { useAppRouter } from 'hooks/useAppRoute'

import BG from 'static/images/background-LT.png'

import './index.less'

const { Content } = Layout

const View = () => {
  const [visible, setVisible] = useState(false)
  const { appRoute } = useAppRouter()
  const { setBackground } = useUI()
  const {
    ui: { width },
  } = useUI()

  const isMobile = width < 992
  const drawerVisible = isMobile ? visible : true
  const desktopCln = !isMobile ? 'sidebar' : 'sidebar mobile'
  const drawerWidth = isMobile ? 350 : 231

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  return (
    <Layout className="main-layout">
      <Drawer
        placement="left"
        className={desktopCln}
        width={drawerWidth}
        mask={isMobile}
        visible={drawerVisible}
        onClose={() => setVisible(false)}
        forceRender
      >
        <SideBar />
      </Drawer>
      <Layout>
        <Content>
          <Row justify="center">
            <Col xs={24} xxl={16}>
              <Switch>
                <Route
                  exact
                  path={`${appRoute}/dashboard`}
                  component={Dashboard}
                />
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
            </Col>
          </Row>
          {isMobile && (
            <Button
              shape="circle"
              className="btn-sidebar"
              icon={
                <IonIcon name={visible ? 'close-outline' : 'menu-outline'} />
              }
              onClick={() => setVisible(!visible)}
            />
          )}
        </Content>
        <DistributorWatcher />
        <ReceiptWatcher />
        <HistoryWatcher />
        <ListReceivedWatcher />
      </Layout>
    </Layout>
  )
}

export default View
