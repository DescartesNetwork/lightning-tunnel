import { useCallback, useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [sentList, setSentList] = useState<ItemSent[]>([])
  const [numberOfRecipient, setNumberOfRecipient] = useState(0)
  const distributors = useSelector((state: AppState) => state.distributors)
  const history = useSelector((state: AppState) => state.history)
  const { listRemaining } = useListRemaining()

  const fetchHistory = useCallback(async () => {
    const nextHistory: ItemSent[] = []
    let newNumberOfRecipient = 0
    const listAddress: string[] = []
    try {
      setLoading(true)
      const airdropSalt = MerkleDistributor.salt(`${appId}/${type}/0`)

      for (const historyItem of history) {
        const { treeData, distributorAddress } = historyItem
        if (!treeData) continue
        const parseData = JSON.parse(JSON.stringify(treeData)).data
        const merkleDistributor = MerkleDistributor.fromBuffer(
          Buffer.from(parseData || treeData),
        )
        const salt = merkleDistributor.receipients[0].salt
        const x = Buffer.compare(airdropSalt, salt)

        if (x !== 0) continue

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
          nextHistory.unshift(itemSent)
          continue
        }
        nextHistory.push(itemSent)
      }
    } catch (er) {
    } finally {
      setLoading(false)
      setNumberOfRecipient(newNumberOfRecipient)
      return setSentList(nextHistory)
    }
  }, [distributors, history, listRemaining, type])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { listHistory: sentList, loading, numberOfRecipient }
}

export default useSentList
