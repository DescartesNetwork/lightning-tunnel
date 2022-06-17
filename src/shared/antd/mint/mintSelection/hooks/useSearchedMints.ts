import { useCallback, useEffect, useState } from 'react'
import { useMint } from '@senhub/providers'

import { useMyMints } from './useMyMints'
import { useSortMints } from 'shared/hooks/useSortMints'
import { useJupiterTokens } from './useJupiterTokens'

let searching: NodeJS.Timeout

export const useSearchedMints = (keyword: string = '', limit: number) => {
  const [loading, setLoading] = useState(false)
  const [searchedMints, setSearchedMints] = useState<string[]>([])
  const { tokenProvider } = useMint()
  const myMints = useMyMints()
  const { sortedMints } = useSortMints(myMints)
  const { verify } = useJupiterTokens()

  const buildDefaultTokens = useCallback(async () => {
    let filteredMints = new Set<string>()
    for (const mint of sortedMints) {
      const valid = await tokenProvider.findByAddress(mint)
      if (valid) filteredMints.add(mint)
    }
    const allMints = await tokenProvider.all()
    for (const mint of allMints) filteredMints.add(mint.address)
    return Array.from(filteredMints)
  }, [sortedMints, tokenProvider])

  const search = useCallback(async () => {
    setLoading(true)
    if (searching) clearTimeout(searching)
    searching = setTimeout(async () => {
      try {
        if (!keyword) {
          const defaultMints = await buildDefaultTokens()
          return setSearchedMints(defaultMints)
        }
        const tokens = await tokenProvider.find(keyword, limit)
        const verifiedTokens: string[] = []
        const unverifiedTokens: string[] = []
        for (const mint of tokens) {
          const verified = verify(mint.address)
          if (verified) verifiedTokens.push(mint.address)
          if (!verified) unverifiedTokens.push(mint.address)
        }
        let mints = verifiedTokens.concat(unverifiedTokens)
        // In some cases, mint that the user wants to select is not included in the token provider
        // This allows the user to choose any mint that the user wants
        if (!mints.length) mints = myMints.filter((mint) => mint === keyword)
        return setSearchedMints(mints)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [buildDefaultTokens, keyword, limit, myMints, tokenProvider, verify])

  useEffect(() => {
    search()
  }, [search])

  return { searchedMints, loading }
}
