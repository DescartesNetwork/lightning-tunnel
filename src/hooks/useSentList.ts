import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import configs from 'configs'
import { AppState } from 'model'
import { useListRemaining } from 'hooks/useListRemaining'
import { TypeDistribute } from 'model/main.controller'
import { useGetMerkle } from './useGetMerkle'

const {
  sol: { utility },
} = configs

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
  const [sentList, setSentList] = useState<ItemSent[]>([])
  const [totalRecipients, setTotalRecipients] = useState<number>()
  const { listRemaining } = useListRemaining()

  const getMerkle = useGetMerkle()
  const walletAddress = useWalletAddress()

  const fetchHistory = useCallback(async () => {
    let history: ItemSent[] = []
    const mapReceiptAuth = new Map<string, boolean>()

    await Promise.all(
      Object.keys(distributors).map(async (distributor) => {
        const distributorData = distributors[distributor]
        // Filter own distributorData
        if (distributorData.authority.toBase58() !== walletAddress) return
        // Filter distributor type
        const merkle = await getMerkle(distributor)
        if (merkle.type !== type) return
        // Count total recipients
        for (const { authority } of merkle.root.receipients) {
          if (!mapReceiptAuth.has(authority.toBase58()))
            mapReceiptAuth.set(authority.toBase58(), true)
        }
        // Build another data
        const treasurerAddress = await utility.deriveTreasurerAddress(
          distributor,
        )

        const remaining = listRemaining[treasurerAddress]
        const time = merkle.metadata.createAt * 1000

        const itemSent: ItemSent = {
          distributorAddress: distributor,
          mint: distributorData.mint.toBase58(),
          total: distributorData.total.toString(),
          time,
          treeData: Buffer.from(merkle.metadata.data),
          remaining,
        }

        history.push(itemSent)
      }),
    )

    history = history.sort((a, b) => {
      if (a.time > b.time) return -1
      return 0
    })

    setTotalRecipients(mapReceiptAuth.size)
    return setSentList(history)
  }, [distributors, getMerkle, listRemaining, type, walletAddress])

  useEffect(() => {
    const timeout = setTimeout(() => fetchHistory(), 500)
    return () => clearTimeout(timeout)
  }, [fetchHistory])

  return {
    listHistory: sentList,
    loading: totalRecipients === undefined,
    numberOfRecipient: totalRecipients || 0,
  }
}

export default useSentList
