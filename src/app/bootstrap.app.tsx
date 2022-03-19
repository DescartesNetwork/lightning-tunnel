import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  MintProvider,
  AccountProvider,
  PoolProvider,
} from '@senhub/providers'

import PageView from 'app/page'
import WidgetView from 'app/widget'

import model from 'app/model'
import configs from 'app/configs'

import 'app/static/styles/light.less'
import 'app/static/styles/dark.less'
import 'app/static/styles/index.less'
import { AppWatcher } from './watcher'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <UIProvider appId={appId} antd>
      <MintProvider>
        <PoolProvider>
          <AccountProvider>
            <WalletProvider>
              <Provider store={model}>
                <AppWatcher>
                  <PageView />
                </AppWatcher>
              </Provider>
            </WalletProvider>
          </AccountProvider>
        </PoolProvider>
      </MintProvider>
    </UIProvider>
  )
}

export const widgetConfig: WidgetConfig = {
  size: 'small',
  type: 'solid',
}

export const Widget = () => {
  return (
    <UIProvider appId={appId} antd>
      <MintProvider>
        <PoolProvider>
          <AccountProvider>
            <WalletProvider>
              <Provider store={model}>
                <AppWatcher>
                  <WidgetView />
                </AppWatcher>
              </Provider>
            </WalletProvider>
          </AccountProvider>
        </PoolProvider>
      </MintProvider>
    </UIProvider>
  )
}
