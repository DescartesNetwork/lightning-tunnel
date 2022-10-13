import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Col, Menu, MenuProps, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { useAppRouter } from 'hooks/useAppRoute'
import { AppDispatch } from 'model'
import { setTypeDistribute } from 'model/main.controller'
import { useRedirectAndClear } from 'hooks/useRedirectAndClear'
import { SIDE_BAR_ITEMS } from '../../constants'
import { useWidth } from '@sentre/senhub'

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

const URL_GUIDE_LINE = 'https://academy.sentre.io/lightning-tunnel-version-2/'

const Header = () => {
  const [sideBarKey, setSideBarKey] = useState(SIDE_BAR_ITEMS.Dashboard)
  const { pathname } = useLocation()
  const { appRoute } = useAppRouter()
  const { onPushAndClear } = useRedirectAndClear()
  const dispatch = useDispatch<AppDispatch>()
  const width = useWidth()

  const onSelect: MenuProps['onClick'] = async (e) => {
    return onPushAndClear(`/${e.key}`)
  }

  const getDefaultSideBarItem = useCallback(() => {
    const key = pathname.replace(`${appRoute}/`, '') as SIDE_BAR_ITEMS
    const indexOf = key.indexOf('/')
    if (indexOf === -1) return setSideBarKey(key)
    return setSideBarKey(key.slice(0, indexOf) as SIDE_BAR_ITEMS)
  }, [appRoute, pathname])

  const fetchDistributeType = useCallback(() => {
    if (sideBarKey === SIDE_BAR_ITEMS.Dashboard) return
    // @ts-ignore
    return dispatch(setTypeDistribute(sideBarKey))
  }, [dispatch, sideBarKey])

  useEffect(() => {
    getDefaultSideBarItem()
  }, [getDefaultSideBarItem])

  useEffect(() => {
    fetchDistributeType()
  }, [fetchDistributeType])

  return (
    <Row className="header" align="middle">
      <Col flex="auto">
        <Menu
          selectedKeys={[sideBarKey]}
          onClick={onSelect}
          items={LIST_MENU_ITEM}
          mode="horizontal"
        />
      </Col>
      <Col>
        <Space
          size={12}
          style={{ cursor: 'pointer' }}
          onClick={() => window.open(URL_GUIDE_LINE, '_blank')}
        >
          <IonIcon style={{ fontSize: 24 }} name="information-circle-outline" />
          {width >= 632 && (
            <Typography.Title level={5}>Guidelines</Typography.Title>
          )}
        </Space>
      </Col>
    </Row>
  )
}

export default Header
