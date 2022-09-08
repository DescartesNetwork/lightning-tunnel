import { useCallback, useState } from 'react'
import { util } from '@sentre/senhub'

import { ALL } from '../constants'
import useStatus from './useStatus'
import { ReceiveItem } from './useReceivedList'

type FilterArguments = { mintAddress?: string; status?: string }

export const useFilterReceiceList = (receivedList: ReceiveItem[]) => {
  const [loading, setLoading] = useState(false)
  const { fetchAirdropStatus } = useStatus()

  const getReceiveMints = useCallback(() => {
    if (!receivedList) return []
    let mints: string[] = []
    for (const receivedItem of receivedList) {
      const { mintAddress } = receivedItem
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
          ? mintAddress === receiveMintAddr
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
        for (const itemReceived of receivedList) {
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
