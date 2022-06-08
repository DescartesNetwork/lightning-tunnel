import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  MintProvider,
  AccountProvider,
  PoolProvider,
} from '@senhub/providers'

import View from 'app/view'
import AnimationBackground from 'app/components/animationBackground'

import model from 'app/model'
import configs from 'app/configs'

import 'app/static/styles/light.less'
import 'app/static/styles/dark.less'
import 'app/static/styles/index.less'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <UIProvider appId={appId} antd={{ prefixCls: appId }}>
      <MintProvider>
        <PoolProvider>
          <AccountProvider>
            <WalletProvider>
              <Provider store={model}>
                <AnimationBackground>
                  <View />
                </AnimationBackground>
              </Provider>
            </WalletProvider>
          </AccountProvider>
        </PoolProvider>
      </MintProvider>
    </UIProvider>
  )
}

export * from 'app/static.app'
