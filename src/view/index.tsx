import { useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Infix, useAppRoute, useInfix } from '@sentre/senhub'

import { Button, Col, Drawer, Layout, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Redeem from './redeem'
import SideBar from './sideBar'
import Dashboard from './dashboard'
import Vesting from './vesting'
import Airdrop from './airdrop'
import AddNewAirdrop from './airdrop/addNewAirdrop'
import AddNewVesting from './vesting/addNewVesting'

import './index.less'

const View = () => {
  const [visible, setVisible] = useState(false)
  const { root, extend } = useAppRoute()
  const infix = useInfix()

  const isMobile = infix < Infix.lg
  const drawerVisible = isMobile ? visible : true
  const desktopCln = !isMobile ? 'sidebar' : 'sidebar mobile'

  return (
    <Layout className="main-layout">
      <Layout.Content>
        <Row justify="center">
          <Col xs={24} xxl={16}>
            <Switch>
              <Route exact path={extend('/dashboard')} component={Dashboard} />
              <Route exact path={extend('/vesting')} component={Vesting} />
              <Route
                exact
                path={extend('/vesting/add-new')}
                component={AddNewVesting}
              />
              <Route
                exact
                path={extend('/airdrop/add-new')}
                component={AddNewAirdrop}
              />
              <Route exact path={extend('/airdrop')} component={Airdrop} />
              <Route
                exact
                path={extend('/redeem/:distributorAddress')}
                component={Redeem}
              />
              <Redirect from="*" to={`${root}/dashboard`} />
            </Switch>
          </Col>
        </Row>
        {isMobile && (
          <Button
            shape="circle"
            className="btn-sidebar"
            icon={<IonIcon name={visible ? 'close-outline' : 'menu-outline'} />}
            onClick={() => setVisible(!visible)}
          />
        )}
        <Drawer
          placement="left"
          className={desktopCln}
          width={231}
          mask={isMobile}
          visible={drawerVisible}
          onClose={() => setVisible(false)}
        >
          <SideBar />
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default View
