import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { HistoryRecord } from 'helper/history'
import { AppState } from 'model'
import { ipfs } from 'model/metadatas.controller'

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryRecord[]>()
  const distributors = useSelector((state: AppState) => state.distributors)
  const metadatas = useSelector((state: AppState) => state.metadatas)

  const walletAddress = useWalletAddress()

  const fetchHistory = useCallback(async () => {
    let listHistory: HistoryRecord[] | undefined
    const listDistributor = Object.keys(distributors).map((address) => ({
      address,
      ...distributors[address],
    }))

    if (!listDistributor.length) return // check loading
    const myDistribute = listDistributor.filter(
      ({ authority }) => authority.toBase58() === walletAddress,
    )

    if (!myDistribute.length) return setHistory([]) // avoid undefined

    for (const distributeData of myDistribute) {
      listHistory = listHistory?.length ? [...listHistory] : []
      const { address, mint, total, metadata: digest } = distributeData
      const cid = ipfs.decodeCID(digest)
      const metadata = metadatas[cid]
      if (!metadata) continue
      const time = metadata.createAt * 1000
      const historyRecord: HistoryRecord = {
        distributorAddress: address,
        mint: mint.toBase58(),
        total: total.toString(),
        time: time ? time : 0,
        treeData: metadata.data,
      }

      listHistory.push(historyRecord)
    }
    return setHistory(listHistory)
  }, [distributors, metadatas, walletAddress])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return history
}
