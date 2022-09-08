import { useCallback, useEffect, useMemo, useState } from 'react'
import { tokenProvider, useGetMintDecimals } from '@sentre/senhub'
import { utilsBN } from '@sen-use/web3'
import { BN } from '@project-serum/anchor'

import { Allocation } from '../constants'
import { TypeDistribute } from 'model/main.controller'
import useSentList from './useSentList'
import { fetchMulCGK, notifyError } from 'helper'
import { useCgk } from './useCgk'

const useAllocation = (type: TypeDistribute) => {
  const [allocation, setAllocation] = useState<Record<string, Allocation>>({})
  const [totalUSD, setTotalUSD] = useState(0)
  const getDecimals = useGetMintDecimals()
  const { listHistory, numberOfRecipient, loading } = useSentList({ type })
  const { getTotalBalance } = useCgk()

  const listToken = useMemo(() => {
    const allocation: Record<string, BN> = {}
    for (const { mint, total } of listHistory) {
      if (allocation[mint]) {
        const oldAmount = allocation[mint]
        allocation[mint] = oldAmount.add(new BN(total))
        continue
      }
      allocation[mint] = new BN(total)
    }
    return allocation
  }, [listHistory])

  const calcTotalUSD = useCallback(async () => {
    const mintBalances: { mint: string; amount: BN }[] = []
    for (const mint in listToken) {
      mintBalances.push({ mint, amount: listToken[mint] })
    }
    const total = await getTotalBalance(mintBalances)
    return setTotalUSD(total)
  }, [getTotalBalance, listToken])

  const calcTokenPrices = useCallback(async () => {
    const tickets: string[] = []
    for (const mint in listToken) {
      const tokenInfo = await tokenProvider.findByAddress(mint)
      const ticket = tokenInfo?.extensions?.coingeckoId
      if (!ticket) continue
      tickets.push(ticket)
    }
    const tokenPrices = await fetchMulCGK(tickets)
    return tokenPrices
  }, [listToken])

  const fetchAllocation = useCallback(async () => {
    try {
      const chartData: Record<string, Allocation> = {}
      if (!totalUSD) return setAllocation(chartData)
      const tokenPrices = await calcTokenPrices()
      for (const mintAddress in listToken) {
        const tokenInfo = await tokenProvider.findByAddress(mintAddress)
        const ticket = tokenInfo?.extensions?.coingeckoId
        if (!ticket) continue
        const decimal = (await getDecimals({ mintAddress })) || 0
        const amountToken = utilsBN.undecimalize(
          listToken[mintAddress],
          decimal,
        )
        const usdValue = tokenPrices[ticket] * Number(amountToken)
        const ratio = (usdValue / totalUSD) * 100
        if (ratio < 2) {
          let newAmountToken = amountToken
          let newUsdValue = usdValue
          let newRatio = ratio
          if (chartData['other']) {
            const {
              amountToken: oldAmount,
              usdValue: oldUsd,
              ratio: oldRatio,
            } = chartData['other']
            newAmountToken += oldAmount
            newUsdValue += oldUsd
            newRatio += oldRatio
          }
          chartData['other'] = {
            name: `Other`,
            symbol: '',
            amountToken: newAmountToken,
            usdValue: newUsdValue,
            ratio: newRatio,
          }
          continue
        } // group the tokens have small percent
        chartData[mintAddress] = {
          name: `${tokenInfo?.name}`,
          symbol: `${tokenInfo?.symbol}`,
          amountToken,
          usdValue,
          ratio,
        }
      }
      return setAllocation(chartData)
    } catch (error) {
      notifyError(error)
    }
  }, [calcTokenPrices, getDecimals, listToken, totalUSD])

  useEffect(() => {
    calcTotalUSD()
  }, [calcTotalUSD])

  useEffect(() => {
    fetchAllocation()
  }, [fetchAllocation])

  return {
    allocation,
    totalUSD,
    numberOfRecipient,
    numberOfCampaigns: listHistory.length,
    loading,
  }
}

export default useAllocation
