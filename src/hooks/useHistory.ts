import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { HistoryRecord } from 'helper/history'
import { ipfs } from 'helper/ipfs'
import { AppState } from 'model'

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
      const time = metadata.createAt
      const historyRecord: HistoryRecord = {
        distributorAddress: address,
        mint: mint.toBase58(),
        total: total.toString(),
        time: time ? time.toString() : '',
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
