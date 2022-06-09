import { useCallback, useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'

const fetchJptTokens = async () => {
  const data = await fetch('https://cache.jup.ag/tokens')
  return data.json()
}

export const useJupiterTokens = () => {
  const [jupiterTokens, setJupiterTokens] = useState(new Map<string, boolean>())
  const { data: tokens } = useSWRImmutable('fetchJptTokens', fetchJptTokens)

  useEffect(() => {
    if (!tokens) return
    const tokenMap = new Map<string, boolean>()
    for (const token of tokens) {
      tokenMap.set(token.address, true)
    }
    setJupiterTokens(tokenMap)
  }, [tokens])

  const verify = useCallback(
    (address: string): boolean => {
      return jupiterTokens.has(address)
    },
    [jupiterTokens],
  )

  return { verify }
}
