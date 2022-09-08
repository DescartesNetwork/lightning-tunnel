import { useEffect, useState } from 'react'
import { getAnchorProvider } from '@sen-use/web3'
import { rpc, useWalletAddress } from '@sentre/senhub'

import configs from 'configs'
import { Utility } from '@sentre/utility'
import { AppWatcher } from 'watcher'
import { HistoryWatcher } from 'hooks/useSentList'

const {
  sol: { utilityProgram },
} = configs

export const AppLoader: React.FC = ({ children }) => {
  const address = useWalletAddress()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return
    const provider = getAnchorProvider(rpc, address, window.sentre.wallet)
    const senUtility = new Utility(provider.wallet, rpc, utilityProgram)
    window.senUtility = senUtility
    setLoaded(true)
  }, [address, loaded])

  if (!loaded) return null
  return (
    <AppWatcher>
      <HistoryWatcher />
      {children}
    </AppWatcher>
  )
}
