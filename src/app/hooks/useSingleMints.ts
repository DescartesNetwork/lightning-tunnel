import { useMint } from '@senhub/providers'
import { useCallback, useEffect, useState } from 'react'

export const useSingleMints = (mints: string[]) => {
  const { tokenProvider } = useMint()
  const [singleMints, setSingleMints] = useState<string[]>([])

  const filterSingleMints = useCallback(async () => {
    const newSingleMints: string[] = []
    for (const mintAddr of mints) {
      const token = await tokenProvider.findByAddress(mintAddr)
      if (token) newSingleMints.push(mintAddr)
    }
    return setSingleMints(newSingleMints)
  }, [tokenProvider, mints])

  useEffect(() => {
    filterSingleMints()
  }, [filterSingleMints])

  return singleMints
}
