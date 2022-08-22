import { useCallback, useState } from 'react'
import { util } from '@sentre/senhub'

import { ALL } from '../constants'
import useStatus from './useStatus'
import { ReceiveItem, useReceivedList } from './useReceivedList'

type FilterArguments = { mintAddress?: string; status?: string }

export const useFilterReceiceList = () => {
  const [loading, setLoading] = useState(false)
  const { fetchAirdropStatus } = useStatus()
  const receivedList = useReceivedList()

  const getReceiveMints = useCallback(() => {
    if (!receivedList) return []
    let mints: string[] = []
    for (const mintHistory in receivedList) {
      const { mintAddress } = receivedList[mintHistory]
      if (!mints.includes(mintAddress)) mints.push(mintAddress)
    }
    return mints
  }, [receivedList])

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
        for (const mintReceived in receivedList) {
          const itemReceived = receivedList[mintReceived]
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
    [receivedList, validReceiveItem],
  )

  return { filterReceiveList, loading, getReceiveMints }
}
