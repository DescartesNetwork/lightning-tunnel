import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSortMints } from 'shared/hooks/useSortMints'
import { net } from 'shared/runtime'
import localStorage from 'shared/storage'
import { useAccount } from '@senhub/providers'

const LIMIT_ITEM = 8
const LOCAL_STORAGE_ID = `${net}:selected_mints`

export const useRecommendedMints = () => {
  const [recommendedMints, setRecommendedMints] = useState<string[]>([])
  const { accounts } = useAccount()

  const mints = useMemo(() => {
    return Object.values(accounts).map((account) => account.mint)
  }, [accounts])
  const { sortedMints } = useSortMints(mints)

  const getRecommendedMints = useCallback(async () => {
    let mints: string[] = localStorage.get(LOCAL_STORAGE_ID) || []
    for (const mint of sortedMints) {
      if (mints.length >= LIMIT_ITEM) break
      if (mints.includes(mint)) continue
      mints.push(mint)
    }
    return setRecommendedMints(mints.slice(0, LIMIT_ITEM))
  }, [sortedMints])

  const addRecommendMint = useCallback(async (mintAddress: string) => {
    let mints: string[] = localStorage.get(LOCAL_STORAGE_ID) || []
    mints = mints.filter((mint) => mint !== mintAddress)
    const newMints = [mintAddress, ...mints].slice(0, LIMIT_ITEM)
    localStorage.set(LOCAL_STORAGE_ID, newMints)

    return setRecommendedMints(newMints)
  }, [])

  useEffect(() => {
    getRecommendedMints()
  }, [getRecommendedMints])

  return {
    recommendedMints,
    addRecommendMint,
  }
}
