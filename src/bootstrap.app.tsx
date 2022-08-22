import { memo, useEffect } from 'react'
import { Provider } from 'react-redux'
import { UIProvider, useUI } from '@sentre/senhub'

import View from 'view'
import AnimationBackground from 'components/animationBackground'
import { AppLoader } from 'appLoader'

import model from 'model'
import configs from 'configs'

import 'static/styles/light.less'
import 'static/styles/dark.less'
import 'static/styles/index.less'
import BG from 'static/images/background-LT.png'

const {
  manifest: { appId },
} = configs

export const Layout = memo(() => {
  return (
    <Provider store={model}>
      <AppLoader>
        <View />
      </AppLoader>
    </Provider>
  )
})

export const Background = () => {
  const { setBackground } = useUI()

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  return (
    <AnimationBackground>
      <Layout />
    </AnimationBackground>
  )
}

export const Page = () => {
  useEffect(() => {
    console.log('123')
  }, [])

  return (
    <UIProvider appId={appId} antd={{ prefixCls: appId }}>
      <Background />
    </UIProvider>
  )
}

export * from 'static.app'
