import { useCallback, useState } from 'react'
import { util } from '@sentre/senhub'

import { ALL } from '../constants'
import useStatus from './useStatus'
import { ReceiveItem, useReceivedList } from './useReceivedList'

type FilterArguments = { mintAddress?: string; status?: string }

export const useFilterReceiceList = () => {
  const [loading, setLoading] = useState(false)
  const { fetchAirdropStatus } = useStatus()
  const { receivedList: listReceived } = useReceivedList()

  const getReceiveMints = useCallback(() => {
    if (!listReceived) return []
    let mints: string[] = []
    for (const mintHistory in listReceived) {
      const { mintAddress } = listReceived[mintHistory]
      if (!mints.includes(mintAddress)) mints.push(mintAddress)
    }
    return mints
  }, [listReceived])

  const validReceiveItem = useCallback(
    async (itemReceived: ReceiveItem, args: FilterArguments) => {
      const {
        recipientData: { startedAt },
        receiptAddress,
        distributorAddress,
        mintAddress: receiveMintAddr,
      } = itemReceived
      const { mintAddress, status } = args

      const mintCheck =
        util.isAddress(receiveMintAddr) && mintAddress !== ALL
          ? [mintAddress].includes(mintAddress)
          : true

      const state = await fetchAirdropStatus({
        distributor: distributorAddress,
        receipt: receiptAddress,
        startedAt: startedAt.toNumber(),
      })
      const statusCheck = !!state && status !== ALL ? status === state : true

      return mintCheck && statusCheck
    },
    [fetchAirdropStatus],
  )

  const filterReceiveList = useCallback(
    async ({ mintAddress = '', status = '' }: FilterArguments) => {
      try {
        setLoading(true)
        let filteredData: ReceiveItem[] = []
        for (const mintReceived in listReceived) {
          const itemReceived = listReceived[mintReceived]
          const state = await validReceiveItem(itemReceived, {
            mintAddress,
            status,
          })
          if (state) filteredData.push(itemReceived)
        }
        return filteredData
      } catch (err) {
        return []
      } finally {
        setLoading(false)
      }
    },
    [listReceived, validReceiveItem],
  )

  return { filterReceiveList, loading, getReceiveMints }
}
