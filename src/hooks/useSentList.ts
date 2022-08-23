import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { AppState } from 'model'
import { useGetAllRemaining } from 'hooks/useListRemaining'
import { TypeDistribute } from 'model/main.controller'
import { useGetMerkle } from './useGetMerkle'

export type ItemSent = {
  remaining: number
  time: number
  mint: string
  total: string | number
  distributorAddress: string
  treeData: Buffer
}

const useSentList = ({ type }: { type: TypeDistribute }) => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const [sentList, setSentList] = useState<{
    loading: boolean
    listHistory: ItemSent[]
    numberOfRecipient: number
  }>({
    loading: true,
    listHistory: [],
    numberOfRecipient: 0,
  })

  const getAllRemaining = useGetAllRemaining()
  const getMerkle = useGetMerkle()
  const walletAddress = useWalletAddress()

  const fetchHistory = useCallback(async () => {
    let history: ItemSent[] = []
    const mapReceiptAuth = new Map<string, boolean>()
    const ownDistributorAddress: string[] = []

    for (const address in distributors) {
      const { authority } = distributors[address]
      if (authority.toBase58() !== walletAddress) continue
      ownDistributorAddress.push(address)
    }

    const allRemaining = await getAllRemaining(ownDistributorAddress)

    await Promise.all(
      ownDistributorAddress.map(async (distributor, index) => {
        const distributorData = distributors[distributor]

        // Filter distributor type
        const merkle = await getMerkle(distributor)
        if (merkle.type !== type) return
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
        }

        history.push(itemSent)
      }),
    )

    history = history.sort((a, b) => {
      if (a.time > b.time || !b.time) return -1
      return 0
    })

    return setSentList({
      listHistory: history,
      loading: false,
      numberOfRecipient: mapReceiptAuth.size,
    })
  }, [distributors, getAllRemaining, getMerkle, type, walletAddress])

  useEffect(() => {
    const timeout = setTimeout(() => fetchHistory(), 1000)
    return () => clearTimeout(timeout)
  }, [fetchHistory])

  return sentList
}

export default useSentList
