import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Menu, MenuProps } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { SIDE_BAR_ITEMS } from '../constants'
import { useAppRouter } from 'app/hooks/useAppRoute'

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

const SideBar = () => {
  const [sideBarKey, setSideBarKey] = useState(SIDE_BAR_ITEMS.Dashboard)
  const { pathname } = useLocation()
  const { appRoute, pushHistory } = useAppRouter()

  const onSelect: MenuProps['onClick'] = (e) => {
    pushHistory(`/${e.key}`)
  }

  const getDefaultSideBarItem = useCallback(() => {
    const key = pathname.replace(`${appRoute}/`, '') as SIDE_BAR_ITEMS
    const indexOf = key.indexOf('/')
    if (indexOf === -1) return setSideBarKey(key)
    return setSideBarKey(key.slice(0, indexOf) as SIDE_BAR_ITEMS)
  }, [appRoute, pathname])

  useEffect(() => {
    getDefaultSideBarItem()
  }, [getDefaultSideBarItem])

  return (
    <Menu
      selectedKeys={[sideBarKey]}
      onSelect={onSelect}
      className="sidebar-content"
      items={LIST_MENU_ITEM}
    />
  )
}

export default SideBar
