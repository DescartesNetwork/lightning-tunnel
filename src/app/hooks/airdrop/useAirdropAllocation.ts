import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMint } from '@senhub/providers'
import { utils } from '@senswap/sen-js'

import { AirdropAllocationType } from 'app/constants'
import { HistoryRecord } from 'app/helper/history'
import { TypeDistribute } from 'app/model/main.controller'
import useSentList from '../useSentList'
import useTotalUSD from '../useTotalUSD'
import { notifyError } from 'app/helper'

const useAirdropAllocation = () => {
  const [airdropAllocation, setAirdropAllocation] = useState<
    Record<string, AirdropAllocationType>
  >({})
  const [totalUSDAirdrop, setTotalUSDAirdrop] = useState(0)
  const [loadingAirdrop, setLoadingAirdrop] = useState(true)
  const { getDecimals, tokenProvider } = useMint()
  const { listHistory, numberOfRecipient } = useSentList({
    type: TypeDistribute.Airdrop,
  })
  const { calcUsdValue } = useTotalUSD()

  const numberOfCampaigns = useMemo(() => {
    return listHistory.length
  }, [listHistory.length])

  const calcTotalTokenByMint = useCallback(
    async (listHistory: HistoryRecord[]) => {
      const allocationList: Record<string, bigint> = {}
      for (const { mint, total } of listHistory) {
        if (!!allocationList[mint]) {
          allocationList[mint] += BigInt(total)
          continue
        }
        allocationList[mint] = BigInt(total)
      }
      return allocationList
    },
    [],
  )

  const handleAirdropValues = useCallback(
    async (airdropAllocation: Record<string, bigint>) => {
      let usdAirdropTotal = 0
      const usdValues: Record<string, number> = {}
      const tokenAmounts: Record<string, number> = {}

      for (const mint of Object.keys(airdropAllocation)) {
        const decimal = await getDecimals(mint)
        const tokenAmount = Number(
          utils.undecimalize(airdropAllocation[mint], decimal),
        )
        tokenAmounts[mint] = tokenAmount
        const usdAirdop = (await calcUsdValue(mint, tokenAmount)) || 0
        usdAirdropTotal += usdAirdop
        usdValues[mint] = usdAirdop
      }

      return { usdValues, usdAirdropTotal, tokenAmounts }
    },
    [calcUsdValue, getDecimals],
  )

  const calcRatioAirdrop = useCallback(
    async (usdValues: Record<string, number>, totalUSDAirdrop: number) => {
      const tokenRatios: Record<string, number> = {}
      for (const mint in usdValues) {
        const ratio = usdValues[mint] / totalUSDAirdrop
        tokenRatios[mint] = ratio
      }
      return tokenRatios
    },
    [],
  )

  const calcAllocationAirdrop = useCallback(async () => {
    try {
      setLoadingAirdrop(true)

      const airdropAllocation = await calcTotalTokenByMint(listHistory)
      const { usdValues, usdAirdropTotal, tokenAmounts } =
        await handleAirdropValues(airdropAllocation)
      setTotalUSDAirdrop(usdAirdropTotal)
      const ratioAirdrops = await calcRatioAirdrop(usdValues, usdAirdropTotal)
      const chartData: Record<string, AirdropAllocationType> = {}

      for (const mint in airdropAllocation) {
        const tokenInfo = await tokenProvider.findByAddress(mint)
        chartData[mint] = {
          mint,
          name: `${tokenInfo?.symbol}(${tokenInfo?.name})`,
          amountToken: tokenAmounts[mint],
          usdValue: usdValues[mint],
          ratioAirdrop: ratioAirdrops[mint],
        }
      }
      setAirdropAllocation(chartData)
    } catch (er) {
      notifyError('Process airdrop data unsuccessfully!')
    } finally {
      setLoadingAirdrop(false)
    }
  }, [
    calcRatioAirdrop,
    calcTotalTokenByMint,
    handleAirdropValues,
    listHistory,
    tokenProvider,
  ])

  useEffect(() => {
    calcAllocationAirdrop()
  }, [calcAllocationAirdrop])

  return {
    airdropAllocation,
    totalUSDAirdrop,
    numberOfRecipient,
    numberOfCampaigns,
    loadingAirdrop,
  }
}

export default useAirdropAllocation
