import { Provider } from 'react-redux'
import { UIProvider } from '@sentre/senhub'

import View from 'view'
import AnimationBackground from 'components/animationBackground'

import model from 'model'
import configs from 'configs'

import 'static/styles/light.less'
import 'static/styles/dark.less'
import 'static/styles/index.less'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <UIProvider appId={appId} antd={{ prefixCls: appId }}>
      <Provider store={model}>
        <AnimationBackground>
          <View />
        </AnimationBackground>
      </Provider>
    </UIProvider>
  )
}

export * from 'static.app'
