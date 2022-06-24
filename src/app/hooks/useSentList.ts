import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MerkleDistributor } from '@sentre/utility'

import { HistoryRecord } from 'app/helper/history'
import configs from 'app/configs'
import { AppState } from 'app/model'
import { CURRENT_TIME } from 'app/constants'
import { getBalanceTreasury } from './useCanRevoke'
import { TypeDistribute } from 'app/model/main.controller'

const {
  manifest: { appId },
} = configs

const useSentList = ({ type }: { type: TypeDistribute }) => {
  const [loading, setLoading] = useState(false)
  const [listHistory, setListHistory] = useState<HistoryRecord[]>([])
  const history = useSelector((state: AppState) => state.history)
  const distributors = useSelector((state: AppState) => state.distributors)

  const fetchHistory = useCallback(async () => {
    const nextHistory: HistoryRecord[] = []
    try {
      setLoading(true)
      const airdropSalt = MerkleDistributor.salt(`${appId}/${type}/0`)
      for (const historyItem of history) {
        const { treeData, distributorAddress } = historyItem
        if (!treeData) continue
        const parseData = JSON.parse(JSON.stringify(treeData)).data
        const merkleDistributor = MerkleDistributor.fromBuffer(
          Buffer.from(parseData),
        )
        const salt = merkleDistributor.recipients[0].salt
        const x = Buffer.compare(airdropSalt, salt)

        if (x !== 0) continue
        const endedAt = distributors[distributorAddress].endedAt
        const endTime = endedAt.toNumber() * 1000
        const balance = await getBalanceTreasury(distributorAddress)
        if (endTime < CURRENT_TIME && endTime && balance) {
          nextHistory.unshift(historyItem)
          continue
        }
        nextHistory.push(historyItem)
      }
    } catch (error) {
    } finally {
      setLoading(false)
      return setListHistory(nextHistory)
    }
  }, [distributors, history, type])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { listHistory, loading }
}

export default useSentList
