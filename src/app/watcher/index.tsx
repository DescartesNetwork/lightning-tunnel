import {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  Fragment,
} from 'react'
import { useWallet } from '@senhub/providers'
import LightningTunnel, { getAnchorProvider } from '@senswap/lightning-tunnel'

import configs from 'app/configs'

export const AppWatcher: FunctionComponent = (props) => {
  const [loading, setLoading] = useState(true)
  const {
    wallet: { address },
  } = useWallet()

  const watchWallet = useCallback(() => {
    if (!address) return
    const { splt, wallet } = window.sentre
    if (!wallet) throw new Error('Login fist')
    try {
      const anchorProvider = getAnchorProvider(splt.nodeUrl, address, wallet)
      window.lightningTunnel = new LightningTunnel(
        anchorProvider,
        configs.sol.lightningTunnelAddress,
      )
    } catch (error) {}

    setLoading(false)
  }, [address])

  useEffect(() => {
    watchWallet()
  }, [watchWallet])

  if (loading) return null
  return <Fragment>{props.children}</Fragment>
}
