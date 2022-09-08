import { useEffect } from 'react'
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

export const Page = () => {
  const setBackground = useSetBackground()

  useEffect(() => {
    setBackground({ light: BG, dark: BG })
  }, [setBackground])

  return (
    <AntdProvider appId={appId} prefixCls={appId}>
      <Provider store={model}>
        <AppLoader>
          <AnimationBackground>
            <View />
          </AnimationBackground>
        </AppLoader>
      </Provider>
    </AntdProvider>
  )
}

export * from 'static.app'
