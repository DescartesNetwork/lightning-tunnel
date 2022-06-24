import { useCallback, useEffect, useState } from 'react'
import { utils } from '@senswap/sen-js'
import { useAccount, useMint } from '@senhub/providers'

import { fetchCGK } from 'shared/util'
import TokenProvider from 'shared/tokenProvider'

const DEFAULT_DATA = {
  address: '',
  icon: '',
  name: 'TOKEN',
  price: 0,
  priceChange: 0,
  rank: 0,
  symbol: 'TOKEN',
  totalVolume: 0,
}

const useTotalUSD = () => {
  const { tokenProvider, getDecimals } = useMint()
  const [totalUSD, setTotalUSD] = useState(0)
  const [loading, setLoading] = useState(true)
  const { accounts } = useAccount()

  const getMintDecimal = useCallback(
    async (mintAddress: string) => {
      try {
        const decimals = await getDecimals(mintAddress)
        return decimals
      } catch (error) {
        return 0
      }
    },
    [getDecimals],
  )

  const fetchCgkData = useCallback(
    async (tokenProvider: TokenProvider, mintAddress: string) => {
      try {
        const token = await tokenProvider.findByAddress(mintAddress)
        const ticket = token?.extensions?.coingeckoId
        const cgkData = await fetchCGK(ticket)
        return cgkData
      } catch (error) {
        return DEFAULT_DATA
      }
    },
    [],
  )

  // const clcTotalUSD = useCallback(async () => {
  //   try {
  //     let totalUSD = 0
  //     for (const account of Object.values(accounts)) {
  //       const { mint, amount } = account
  //       const decimals = await getMintDecimal(mint)
  //       const cgkData = await fetchCgkData(tokenProvider, mint)
  //       const tokenBalance = Number(utils.undecimalize(amount, decimals))
  //       const usdBalance = tokenBalance * cgkData.price
  //       totalUSD += usdBalance
  //     }
  //     return setTotalUSD(totalUSD)
  //   } catch (error) {
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [accounts, fetchCgkData, getMintDecimal, tokenProvider])

  const calcUsdValue = useCallback(
    async (address: string, amount: number) => {
      try {
        const cgkData = await fetchCgkData(tokenProvider, address)

        return amount * cgkData.price
      } catch (error) {
      } finally {
        setLoading(false)
      }
    },
    [fetchCgkData, tokenProvider],
  )

  // useEffect(() => {
  //   clcTotalUSD()
  // }, [clcTotalUSD])

  return { loading, totalUSD, calcUsdValue }
}

export default useTotalUSD
