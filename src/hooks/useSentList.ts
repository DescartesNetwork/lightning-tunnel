import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { MerkleDistributor } from '@sentre/utility'

import { HistoryRecord } from 'helper/history'
import configs from 'configs'
import { AppState } from 'model'
import useListRemaining from 'hooks/useListRemaining'

import { TypeDistribute } from 'model/main.controller'

const {
  manifest: { appId },
  sol: { utility },
} = configs

const CURRENT_TIME = Date.now()

export type ItemSent = HistoryRecord & {
  remaining: number
}

const useSentList = ({ type }: { type: TypeDistribute }) => {
  const [sentList, setSentList] = useState<ItemSent[]>([])
  const [numberOfRecipient, setNumberOfRecipient] = useState(0)
  const distributors = useSelector((state: AppState) => state.distributors)
  const { listHistory } = useSelector((state: AppState) => state.history)
  const { listRemaining } = useListRemaining()

  const loading = useMemo(
    () => (listHistory === undefined ? true : false),
    [listHistory],
  )

  const fetchHistory = useCallback(async () => {
    let nextHistory: ItemSent[] = []
    const readyHistory: ItemSent[] = []
    const otherHistory: ItemSent[] = []

    let newNumberOfRecipient = 0
    const listAddress: string[] = []
    try {
      const airdropSalt_v1 = MerkleDistributor.salt('0')
      const airdropSalt_v2 = MerkleDistributor.salt(`${appId}/${type}/0`)

      if (!listHistory) return
      for (const historyItem of listHistory) {
        const { treeData, distributorAddress } = historyItem
        if (!treeData || !distributors[distributorAddress]) continue
        const parseData = JSON.parse(JSON.stringify(treeData)).data
        const merkleDistributor = MerkleDistributor.fromBuffer(
          Buffer.from(parseData || treeData),
        )
        const salt = merkleDistributor.receipients[0].salt
        const x1 = Buffer.compare(airdropSalt_v1, salt)
        const x2 = Buffer.compare(airdropSalt_v2, salt)

        if (x1 !== 0 && x2 !== 0) continue

        for (const { authority } of merkleDistributor.receipients) {
          if (!listAddress.includes(authority.toBase58()))
            listAddress.push(authority.toBase58())
        }
        newNumberOfRecipient = listAddress.length

        const endedAt = distributors[distributorAddress].endedAt
        const endTime = endedAt.toNumber() * 1000
        const treasurerAddress = await utility.deriveTreasurerAddress(
          distributorAddress,
        )
        const remaining = listRemaining[treasurerAddress]
        const itemSent = { ...historyItem, remaining }

        if (
          endTime < CURRENT_TIME &&
          endTime &&
          listRemaining[treasurerAddress]
        ) {
          readyHistory.unshift(itemSent)
          continue
        }
        otherHistory.push(itemSent)
      }
    } catch (er) {
    } finally {
      setNumberOfRecipient(newNumberOfRecipient)

      const sortHistory = otherHistory.sort((a, b) => {
        const time_a = a.time ? new Date(a.time).getTime() : 0
        const time_b = b.time ? new Date(b.time).getTime() : 0
        return time_b - time_a
      })
      nextHistory = readyHistory.concat(sortHistory)
      return setSentList(nextHistory)
    }
  }, [distributors, listHistory, listRemaining, type])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { listHistory: sentList, loading, numberOfRecipient }
}

export default useSentList
