import { useCallback, useState, Fragment, useMemo } from 'react'
import { createGlobalState, useDebounce } from 'react-use'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { AppState } from 'model'
import { useGetAllRemaining } from 'hooks/useListRemaining'
import { TypeDistribute } from 'model/main.controller'
import { useGetMerkle } from './useGetMerkle'
import { DistributorState } from 'model/distributor.controller'

export type ItemSent = {
  remaining: number
  time: number
  mint: string
  total: string | number
  distributorAddress: string
  treeData: Buffer
  type: TypeDistribute
}

const useSentList = ({ type }: { type: TypeDistribute }) => {
  const [globalHistory] = useGlobalHistory()

  const result = useMemo(() => {
    const filteredHistory = globalHistory.listHistory.filter(
      (elm) => elm.type === type,
    )
    return {
      ...globalHistory,
      listHistory: filteredHistory,
    }
  }, [globalHistory, type])

  return result
}

export default useSentList

const useGlobalHistory = createGlobalState<{
  loading: boolean
  listHistory: ItemSent[]
  numberOfRecipient: number
}>({
  loading: true,
  listHistory: [],
  numberOfRecipient: 0,
})

export const HistoryWatcher = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const [filteredDistributors, setFilteredDistributors] =
    useState<DistributorState>({})
  const [, setGlobalHistory] = useGlobalHistory()
  const getAllRemaining = useGetAllRemaining()
  const getMerkle = useGetMerkle()
  const walletAddress = useWalletAddress()

  const filterDistributors = useCallback(() => {
    const newDistributorState: DistributorState = {}
    for (const addr in distributors) {
      const distributorData = distributors[addr]
      if (distributorData.authority.toBase58() !== walletAddress) continue
      newDistributorState[addr] = distributorData
    }
    if (Object.keys(newDistributorState).length) {
      return setFilteredDistributors(newDistributorState)
    }
  }, [distributors, walletAddress])
  useDebounce(filterDistributors, 1000, [filterDistributors])

  const fetchHistory = useCallback(async () => {
    if (!Object.keys(filteredDistributors).length)
      return setGlobalHistory({
        listHistory: [],
        loading: false,
        numberOfRecipient: 0,
      })

    let history: ItemSent[] = []
    const mapReceiptAuth = new Map<string, boolean>()
    const allRemaining = await getAllRemaining(filteredDistributors)

    await Promise.all(
      Object.keys(filteredDistributors).map(async (distributor, index) => {
        try {
          const distributorData = filteredDistributors[distributor]
          // Filter distributor type
          var merkle = await getMerkle(distributor)
          // Count total recipients
          for (const { authority } of merkle.root.receipients) {
            if (!mapReceiptAuth.has(authority.toBase58()))
              mapReceiptAuth.set(authority.toBase58(), true)
          }
          // Build another data
          const remaining = allRemaining[index].amount

          const itemSent: ItemSent = {
            distributorAddress: distributor,
            mint: distributorData.mint.toBase58(),
            total: distributorData.total.toString(),
            time: merkle.metadata.createAt * 1000,
            treeData: Buffer.from(merkle.metadata.data),
            remaining,
            type: merkle.type,
          }

          history.push(itemSent)
        } catch (error) {
          console.error('error history', error)
        }
      }),
    )

    history = history.sort((a, b) => {
      if (a.time > b.time) return -1
      return 0
    })

    return setGlobalHistory({
      listHistory: history,
      loading: false,
      numberOfRecipient: mapReceiptAuth.size,
    })
  }, [filteredDistributors, getAllRemaining, getMerkle, setGlobalHistory])
  useDebounce(fetchHistory, 1000, [fetchHistory])

  return <Fragment />
}
