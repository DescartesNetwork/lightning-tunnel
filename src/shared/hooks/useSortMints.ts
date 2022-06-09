import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from '@senhub/providers'

import { useJupiterTokens } from 'shared/antd/mint/mintSelection/hooks/useJupiterTokens'

export const useSortMints = (mints: string[]) => {
  const [sortedMints, setSortedMints] = useState<string[]>([])
  const { verify } = useJupiterTokens()
  const { accounts } = useAccount()

  const mapMintAmounts = useMemo(() => {
    const mapMints: Record<string, number> = {}
    for (const account of Object.values(accounts)) {
      mapMints[account.mint] = Number(account.amount.toString())
    }
    return mapMints
  }, [accounts])

  const sortMints = useCallback(
    async (mintAddresses: string[]) => {
      const sortedMints = mintAddresses.sort((a, b) => {
        let amountA = mapMintAmounts[a] || (verify(a) ? 1 : -1)
        let amountB = mapMintAmounts[b] || (verify(b) ? 1 : -1)
        return Number(amountB) - Number(amountA)
      })
      return setSortedMints(sortedMints)
    },
    [mapMintAmounts, verify],
  )
  useEffect(() => {
    sortMints(mints)
  }, [mints, sortMints])

  return { sortedMints, sortMints }
}
