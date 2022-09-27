import { Switch, Route, Redirect } from 'react-router-dom'
import { useAppRoute } from '@sentre/senhub'

import { Col, Layout, Row } from 'antd'
import Redeem from './redeem'
import Header from './header'
import Dashboard from './dashboard'
import Vesting from './vesting'
import Airdrop from './airdrop'
import AddNewAirdrop from './airdrop/addNewAirdrop'
import AddNewVesting from './vesting/addNewVesting'

import './index.less'

const View = () => {
  const { root, extend } = useAppRoute()

  return (
    <Layout className="main-layout">
      <Row justify="center">
        <Col span={24}>
          <Header />
        </Col>
        <Col xs={24} xxl={16} className="main-layout_content">
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
    </Layout>
  )
}

export default View
