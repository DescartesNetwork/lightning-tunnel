import { useCallback, useEffect, useState } from 'react'
import { useMint } from '@senhub/providers'

import { useMyMints } from './useMyMints'
import { useSortMints } from 'shared/hooks/useSortMints'

let searching: NodeJS.Timeout

export const useSearchedMints = (keyword: string = '', limit: number) => {
  const [loading, setLoading] = useState(false)
  const [searchedMints, setSearchedMints] = useState<string[]>([])
  const { tokenProvider } = useMint()
  const myMints = useMyMints()
  const { sortedMints } = useSortMints(myMints)

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
          const mints = await buildDefaultTokens()
          return setSearchedMints(mints)
        }
        const tokens = await tokenProvider.find(keyword, limit)
        let mints = tokens.map((token) => token.address)
        // In some cases, mint that the user wants to select is not included in the token provider
        // This allows the user to choose any mint that the user wants
        if (!mints.length) mints = myMints.filter((mint) => mint === keyword)
        return setSearchedMints(mints)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [buildDefaultTokens, keyword, limit, myMints, tokenProvider])

  useEffect(() => {
    search()
  }, [search])

  return { searchedMints, loading }
}
