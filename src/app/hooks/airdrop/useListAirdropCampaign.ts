import { useCallback, useEffect, useState } from 'react'
import { MerkleDistributor } from '@sentre/utility'
import { useSelector } from 'react-redux'

import configs from 'app/configs'
import { CURRENT_TIME } from 'app/constants'
import { HistoryRecord } from 'app/helper/history'
import { AppState } from 'app/model'
import { getBalanceTreasury } from '../useCanRevoke'

const {
  manifest: { appId },
} = configs

const useListAirdropCampaign = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const [loading, setLoading] = useState(false)
  const [listHistory, setListHistory] = useState<HistoryRecord[]>([])
  const { history } = useSelector((state: AppState) => state)

  console.log(history, 'history')

  const fetchHistory = useCallback(async () => {
    const nextHistory: HistoryRecord[] = []
    try {
      setLoading(true)
      const airdropSalt = MerkleDistributor.salt(`${appId}/airdrop/0`)
      for (const historyItem of history) {
        const { treeData, distributorAddress } = historyItem
        const endedAt = distributors[distributorAddress].endedAt
        const endTime = endedAt.toNumber() * 1000
        const balance = await getBalanceTreasury(distributorAddress)

        if (!treeData) continue
        const parseData = JSON.parse(JSON.stringify(treeData)).data
        const merkleDistributor = MerkleDistributor.fromBuffer(
          Buffer.from(parseData),
        )
        console.log('Merkle Distributor:', merkleDistributor)
        const salt = merkleDistributor.recipients[0].salt
        const x = Buffer.compare(airdropSalt, salt)

        if (x !== 0) continue
        console.log('check')
        if (endTime < CURRENT_TIME && endTime && balance) {
          nextHistory.unshift(historyItem)
          continue
        }
        nextHistory.push(historyItem)
      }
      console.log(nextHistory, '123')
    } catch (error) {
    } finally {
      setLoading(false)
      return setListHistory(nextHistory)
    }
  }, [distributors, history])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { listHistory, loading }
}

export default useListAirdropCampaign
