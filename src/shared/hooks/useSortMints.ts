import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from '@sentre/senhub'

export const useSortMints = (mints: string[]) => {
  const [sortedMints, setSortedMints] = useState<string[]>([])
  const { accounts } = useAccount()

  const mapMintAmounts = useMemo(() => {
    const mapMints: Map<string, number> = new Map()
    for (const account of Object.values(accounts)) {
      mapMints.set(account.mint, Number(account.amount.toString()))
    }
    return mapMints
  }, [accounts])

  const sortMints = useCallback(
    async (mintAddresses: string[]) => {
      if (!mapMintAmounts.size) return setSortedMints([])
      const sortedMints = mintAddresses.sort((a, b) => {
        let amountA = mapMintAmounts.get(a) || -1
        let amountB = mapMintAmounts.get(b) || -1
        return amountB - amountA
      })
      return setSortedMints(sortedMints)
    },
    [mapMintAmounts],
  )
  useEffect(() => {
    sortMints(mints)
  }, [mints, sortMints])

  return { sortedMints, sortMints }
}
