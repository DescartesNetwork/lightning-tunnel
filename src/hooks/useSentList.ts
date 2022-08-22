import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { HistoryRecord } from 'helper/history'
import configs from 'configs'
import { AppState } from 'model'
import useListRemaining from 'hooks/useListRemaining'

import { TypeDistribute } from 'model/main.controller'
import { useHistory } from './useHistory'
import { useGetMerkle } from './useGetMerkle'

const {
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
  const { listRemaining } = useListRemaining()
  const history = useHistory()
  const getMerkle = useGetMerkle()

  const loading = useMemo(() => {
    return history === undefined ? true : false
  }, [history])

  const fetchHistory = useCallback(async () => {
    let nextHistory: ItemSent[] = []
    const readyHistory: ItemSent[] = []
    const otherHistory: ItemSent[] = []

    let newNumberOfRecipient = 0
    const listAddress: string[] = []
    try {
      if (!history) return
      for (const historyItem of history) {
        const { distributorAddress } = historyItem
        const merkle = await getMerkle(distributorAddress)
        if (merkle.type !== type) continue

        for (const { authority } of merkle.root.receipients) {
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
        const time_a = a.time ? Number(a.time) : 0
        const time_b = b.time ? Number(b.time) : 0
        return time_b - time_a
      })
      nextHistory = readyHistory.concat(sortHistory)
      return setSentList(nextHistory)
    }
  }, [distributors, getMerkle, history, listRemaining, type])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])
  return { listHistory: sentList, loading, numberOfRecipient }
}

export default useSentList
