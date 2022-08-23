import { memo, useEffect } from 'react'
import { Provider } from 'react-redux'
import { AntdProvider, useSetBackground } from '@sentre/senhub'

import View from 'view'
import AnimationBackground from 'components/animationBackground'
import { AppLoader } from 'appLoader'

import model from 'model'
import configs from 'configs'

import BG from 'static/images/background-LT.png'

import 'static/styles/light.less'
import 'static/styles/dark.less'
import 'static/styles/index.less'

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
  const setBackground = useSetBackground()

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
  return (
    <AntdProvider appId={appId} prefixCls={appId}>
      <Background />
    </AntdProvider>
  )
}

export * from 'static.app'
