import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import {
  Avatar,
  Col,
  Layout,
  Menu,
  MenuProps,
  Row,
  Space,
  Typography,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useAppRouter } from 'hooks/useAppRoute'
import { AppDispatch } from 'model'
import { onSelectMethod, setTypeDistribute } from 'model/main.controller'
import { onSelectStep } from 'model/steps.controller'
import {
  removeRecipients,
  setExpiration,
  setGlobalUnlockTime,
} from 'model/recipients.controller'
import { SelectMethod, Step, SIDE_BAR_ITEMS } from '../../constants'

import LOGO from 'static/images/logo.svg'

const LIST_MENU_ITEM = [
  {
    label: 'Dashboard',
    key: SIDE_BAR_ITEMS.Dashboard,
    icon: <IonIcon name="grid-outline" style={{ fontSize: 24 }} />,
  },
  {
    label: 'Airdrop',
    key: SIDE_BAR_ITEMS.Airdrop,
    icon: <IonIcon name="cloud-download-outline" style={{ fontSize: 24 }} />,
  },
  {
    label: 'Vesting',
    key: SIDE_BAR_ITEMS.Vesting,
    icon: <IonIcon name="receipt-outline" style={{ fontSize: 24 }} />,
  },
]

const URL_GUIDE_LINE =
  'https://academy.sentre.io/#/blogs/123246296205?category=dev'

const SideBar = () => {
  const [sideBarKey, setSideBarKey] = useState(SIDE_BAR_ITEMS.Dashboard)
  const { pathname } = useLocation()
  const { appRoute, pushHistory } = useAppRouter()
  const dispatch = useDispatch<AppDispatch>()

  const { Content, Footer } = Layout

  const onSelect: MenuProps['onClick'] = async (e) => {
    await dispatch(onSelectStep(Step.SelectMethod))
    await dispatch(onSelectMethod(SelectMethod.manual))
    await dispatch(removeRecipients())
    await dispatch(setGlobalUnlockTime(0))
    await dispatch(setExpiration(0))
    return pushHistory(`/${e.key}`)
  }

  const getDefaultSideBarItem = useCallback(() => {
    const key = pathname.replace(`${appRoute}/`, '') as SIDE_BAR_ITEMS
    const indexOf = key.indexOf('/')
    if (indexOf === -1) return setSideBarKey(key)
    return setSideBarKey(key.slice(0, indexOf) as SIDE_BAR_ITEMS)
  }, [appRoute, pathname])

  const fetchDistributeType = useCallback(() => {
    if (sideBarKey === SIDE_BAR_ITEMS.Dashboard) return
    return dispatch(setTypeDistribute(sideBarKey))
  }, [dispatch, sideBarKey])

  useEffect(() => {
    getDefaultSideBarItem()
  }, [getDefaultSideBarItem])

  useEffect(() => {
    fetchDistributeType()
  }, [fetchDistributeType])

  return (
    <Layout className="sidebar-layout">
      <Content>
        <Row>
          <Col span={24} style={{ padding: '24px 16px' }}>
            <Space>
              <Avatar size={24} src={LOGO} shape="square" />
              <Typography.Title level={5}>Lightning tunnel</Typography.Title>
            </Space>
          </Col>
          <Col span={24}>
            <Menu
              selectedKeys={[sideBarKey]}
              onClick={onSelect}
              className="sidebar-content"
              items={LIST_MENU_ITEM}
            />
          </Col>
        </Row>
      </Content>
      <Footer className="sidebar_footer">
        <Space
          size={12}
          style={{ cursor: 'pointer' }}
          onClick={() => window.open(URL_GUIDE_LINE, '_blank')}
        >
          <IonIcon style={{ fontSize: 24 }} name="information-circle-outline" />
          <Typography.Title level={5}>Guidelines</Typography.Title>
        </Space>
      </Footer>
    </Layout>
  )
}

export default SideBar
