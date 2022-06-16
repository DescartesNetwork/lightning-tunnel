import { useCallback, useEffect, useState } from 'react'
import { useMint } from '@senhub/providers'

export const useAllMints = () => {
  const [mints, setMints] = useState<string[]>([])
  const { tokenProvider } = useMint()

  const getAllMintAddress = useCallback(async () => {
    const tokens = await tokenProvider.getTokenMap()
    return setMints(Array.from(tokens.keys()))
  }, [tokenProvider])

  useEffect(() => {
    getAllMintAddress()
  }, [getAllMintAddress])

  return mints
}
