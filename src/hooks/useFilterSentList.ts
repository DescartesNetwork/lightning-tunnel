import { useCallback, useMemo, useState } from 'react'
import { util } from '@sentre/senhub'

import useSentList, { ItemSent } from 'hooks/useSentList'
import { ALL, ONE_DAY } from '../constants'
import { TypeDistribute } from 'model/main.controller'

type FilterArguments = { mintAddress?: string; time?: string }

export const useFilterSentList = (type: TypeDistribute) => {
  const { listHistory } = useSentList({ type })
  const [loading, setLoading] = useState(false)

  const sentMints = useMemo(() => {
    if (!listHistory.length) return []
    let mints: string[] = []
    for (const mintHistory of listHistory) {
      const { mint: mintAddress } = mintHistory
      if (!mints.includes(mintAddress)) mints.push(mintAddress)
    }
    return mints
  }, [listHistory])

  const validSentItem = useCallback(
    (itemSent: ItemSent, args: FilterArguments) => {
      const { time: timeSent, mint: mintSent } = itemSent
      const createAt = Number(new Date(timeSent))
      const { mintAddress, time } = args

      const mintCheck =
        util.isAddress(mintSent) && mintAddress !== ALL
          ? [mintAddress].includes(mintSent)
          : true

      const timeCheck =
        !!createAt && time !== ALL
          ? Date.now() - createAt < Number(time) * ONE_DAY
          : true

      return mintCheck && timeCheck
    },
    [],
  )

  const filterSentList = useCallback(
    ({ mintAddress = '', time = '' }: FilterArguments) => {
      try {
        setLoading(true)
        const filterdData = listHistory.filter((itemSent) =>
          validSentItem(itemSent, { mintAddress, time }),
        )
        return filterdData
      } catch (err) {
        return []
      } finally {
        setLoading(false)
      }
    },
    [listHistory, validSentItem],
  )

  return { filterSentList, loading, sentMints }
}
