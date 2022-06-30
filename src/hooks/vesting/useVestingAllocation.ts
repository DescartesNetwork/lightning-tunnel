import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMint } from '@sentre/senhub'

import { AllocationType } from '../../constants'
import { HistoryRecord } from 'helper/history'
import { TypeDistribute } from 'model/main.controller'
import useSentList from '../useSentList'
import { notifyError } from 'helper'
import { useCgk } from '../useCgk'
import { utilsBN } from 'helper/utilsBN'

const useVestingAllocation = () => {
  const [vestingAllocation, setVestingAllocation] = useState<
    Record<string, AllocationType>
  >({})
  const [totalUSDVesting, setTotalUSDVesting] = useState(0)
  const [loadingVesting, setLoadingVesting] = useState(false)
  const { getDecimals, tokenProvider } = useMint()
  const { listHistory, numberOfRecipient } = useSentList({
    type: TypeDistribute.Vesting,
  })
  const { getTotalBalance } = useCgk()

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

  const handleVestingValues = useCallback(
    async (vestingAllocation: Record<string, bigint>) => {
      let usdVestingTotal = 0
      const usdValues: Record<string, number> = {}
      const tokenAmounts: Record<string, number> = {}
      for (const mint of Object.keys(vestingAllocation)) {
        const decimal = await getDecimals(mint)
        const vestingAmount = utilsBN.fromBigint(vestingAllocation[mint])
        const tokenAmount = utilsBN.undecimalize(vestingAmount, decimal)
        const usdVesting = await getTotalBalance([
          { mint, amount: vestingAmount },
        ])
        usdVestingTotal += usdVesting
        usdValues[mint] = usdVesting
        tokenAmounts[mint] = Number(tokenAmount)
      }
      return { usdValues, usdVestingTotal, tokenAmounts }
    },
    [getDecimals, getTotalBalance],
  )

  const calcRatioVesting = useCallback(
    async (usdValues: Record<string, number>, totalUSDVesting: number) => {
      const tokenRatios: Record<string, number> = {}
      for (const mint in usdValues) {
        const ratio = usdValues[mint] / totalUSDVesting
        tokenRatios[mint] = ratio
      }
      return tokenRatios
    },
    [],
  )

  const calcAllocationVesting = useCallback(async () => {
    if (!listHistory.length) return
    try {
      setLoadingVesting(true)

      const vestingAllocation = await calcTotalTokenByMint(listHistory)
      const { usdValues, usdVestingTotal, tokenAmounts } =
        await handleVestingValues(vestingAllocation)
      setTotalUSDVesting(usdVestingTotal)
      const ratioVestings = await calcRatioVesting(usdValues, usdVestingTotal)
      const chartData: Record<string, AllocationType> = {}

      for (const mint in vestingAllocation) {
        const tokenInfo = await tokenProvider.findByAddress(mint)
        chartData[mint] = {
          mint,
          name: `${tokenInfo?.symbol}`,
          amountToken: tokenAmounts[mint],
          usdValue: usdValues[mint],
          ratio: ratioVestings[mint],
        }
      }
      setVestingAllocation(chartData)
    } catch (er) {
      notifyError('Process vesting data unsuccessfully!')
    } finally {
      setLoadingVesting(false)
    }
  }, [
    calcRatioVesting,
    calcTotalTokenByMint,
    handleVestingValues,
    listHistory,
    tokenProvider,
  ])

  useEffect(() => {
    calcAllocationVesting()
  }, [calcAllocationVesting])

  return {
    vestingAllocation,
    totalUSDVesting,
    numberOfRecipient,
    numberOfCampaigns,
    loadingVesting,
  }
}

export default useVestingAllocation
