import { useMint } from '@senhub/providers'
import { utils } from '@senswap/sen-js'
import { MerkleDistributor } from '@sentre/utility'
import { HistoryRecord } from 'app/helper/history'
import { TypeDistribute } from 'app/model/main.controller'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSentList from '../useSentList'
import useTotalUSD from '../useTotalUSD'
import useListAirdropCampaign from './useListAirdropCampaign'

export type AirdropAllocationType = {
  mint: string
  name: string
  amountToken: number
  usdValue: number
  percentInTotal: number
}

const useAirdropAllocation = () => {
  const [airdropAllocation, setAirdropAllocation] = useState<
    Map<string, AirdropAllocationType>
  >(new Map<string, AirdropAllocationType>())
  const [totalUSDAirdrop, setTotalUSDAirdrop] = useState(0)
  // const [totalReceipient, setTotalRecei] = useState()
  const { getDecimals, tokenProvider } = useMint()
  const { listHistory } = useSentList({ type: TypeDistribute.Airdrop })
  const { calcUsdValue } = useTotalUSD()
  // const numberOfCampaigns = useMemo(() => {
  //   return listHistory.length
  // }, [listHistory.length])
  // const totalRecipients = useMemo(() => {
  //   let totalRecipient = 0
  //   for (const airdrop of listHistory) {
  //     const parseData = JSON.parse(JSON.stringify(airdrop.treeData)).data
  //     const merkleDistributor = MerkleDistributor.fromBuffer(
  //       Buffer.from(parseData),
  //     )
  //     console.log('merkleDistributor:', merkleDistributor)
  //     if (merkleDistributor) {
  //       totalRecipient += merkleDistributor.recipients.length
  //     }
  //   }
  //   return totalRecipient
  // }, [listHistory])

  const calTotalTokenByMint = useCallback(
    async (listHistory: HistoryRecord[]) => {
      const airdropList = new Map<string, AirdropAllocationType>()
      for (const { mint, total } of listHistory) {
        const decimal = await getDecimals(mint)
        const numberFormatedTotal = Number(
          utils.undecimalize(BigInt(total), decimal),
        )
        if (airdropList.has(mint)) {
          const tokenAirdropInfo = airdropList.get(mint)
          if (tokenAirdropInfo) {
            tokenAirdropInfo.amountToken += numberFormatedTotal
            airdropList.set(mint, {
              ...tokenAirdropInfo,
            })
            continue
          }
        }
        const { symbol } = (await tokenProvider.findByAddress(mint)) || {}
        airdropList.set(mint, {
          mint,
          name: symbol || '',
          amountToken: numberFormatedTotal,
          usdValue: 0,
          percentInTotal: 0,
        })
      }
      return airdropList
    },
    [getDecimals, tokenProvider],
  )

  console.log('List history: ', listHistory)

  const calcUsdValueAirdrop = useCallback(
    async (airdropAllocationList: Map<string, AirdropAllocationType>) => {
      let totalUSDAirdrop = 0

      for (const value of Array.from(airdropAllocationList.values())) {
        const usdValueAirdop =
          (await calcUsdValue(value.mint, value.amountToken)) || 0
        totalUSDAirdrop += usdValueAirdop
        airdropAllocationList.set(value.mint, {
          ...value,
          usdValue: usdValueAirdop,
        })
      }

      return { airdropAllocationList, totalUSDAirdrop }
    },
    [calcUsdValue],
  )

  const calcRatioAirdrop = useCallback(
    async (
      airdropAllocationList: Map<string, AirdropAllocationType>,
      totalUSDAirdrop: number,
    ) => {
      airdropAllocationList.forEach(async (value, key) => {
        const ratio = value.usdValue / totalUSDAirdrop
        console.log(ratio, totalUSDAirdrop)
        airdropAllocationList.set(key, {
          ...value,
          percentInTotal: ratio,
        })
      })
      return airdropAllocationList
    },
    [],
  )

  const calcAllocationAirdrop = useCallback(async () => {
    const tokenAmountHandledAirdrop = await calTotalTokenByMint(listHistory)
    const { airdropAllocationList, totalUSDAirdrop } =
      await calcUsdValueAirdrop(tokenAmountHandledAirdrop)
    setTotalUSDAirdrop(totalUSDAirdrop)
    const ratioCalcedAirdrop = await calcRatioAirdrop(
      airdropAllocationList,
      totalUSDAirdrop,
    )
    setAirdropAllocation(ratioCalcedAirdrop)
  }, [calTotalTokenByMint, calcRatioAirdrop, calcUsdValueAirdrop, listHistory])

  useEffect(() => {
    calcAllocationAirdrop()
  }, [calcAllocationAirdrop])

  return {
    airdropAllocation,
    totalUSDAirdrop,
    // numberOfCampaigns,
    // totalRecipients,
  }
}

export default useAirdropAllocation
