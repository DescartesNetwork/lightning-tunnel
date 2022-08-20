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
    await Promise.all(
      listDistributor.map(async (distributeData) => {
        try {
          listHistory = listHistory?.length ? [...listHistory] : []
          const { address, mint, total, metadata, authority } = distributeData
          if (authority.toBase58() !== walletAddress) return
          const cid = ipfs.decodeCID(metadata)
          const treeData = metadatas[cid].data
          const time = metadatas[cid].createAt
          const historyRecord: HistoryRecord = {
            distributorAddress: address,
            mint: mint.toBase58(),
            total: total.toString(),
            time: time ? time.toString() : '',
            treeData,
          }

          listHistory.push(historyRecord)
        } catch (error) {}
      }),
    )

    setHistory(listHistory)
  }, [distributors, metadatas, walletAddress])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return history
}
