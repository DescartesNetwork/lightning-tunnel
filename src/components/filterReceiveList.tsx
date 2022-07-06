import { useCallback, useEffect, useMemo, useState } from 'react'
import { account } from '@senswap/sen-js'

import { Space } from 'antd'
import SelectExistMintToken from './selectExistMintToken'

import { ReceiveItem } from 'model/listReceived.controller'
import SelectTokenByStatus from './selectTokenByStatus'
import useStatus from 'hooks/useStatus'

const ALL = 'all'

type FilterReceiveListProps = {
  listReceive: ReceiveItem[]
  onFilter: (data: ReceiveItem[]) => void
}
const FilterReceiveList = ({
  listReceive,
  onFilter,
}: FilterReceiveListProps) => {
  const [mintKey, setMintKey] = useState('all')
  const [statusKey, setStatusKey] = useState('all')
  const { fetchAirdropStatus } = useStatus()

  const listMintAddr = useMemo(() => {
    if (!listReceive.length) return []
    let mints: string[] = []
    for (const item of listReceive) {
      const { mintAddress } = item
      if (!mints.includes(mintAddress)) mints.push(mintAddress)
    }
    return mints
  }, [listReceive])

  const validReceiveItem = useCallback(
    async (receiveItem: ReceiveItem) => {
      const {
        recipientData: { startedAt },
        receiptAddress,
        distributorAddress,
        mintAddress,
      } = receiveItem

      const mintCheck =
        account.isAddress(mintAddress) && mintKey !== ALL
          ? [mintKey].includes(mintAddress)
          : true

      const state = await fetchAirdropStatus({
        distributor: distributorAddress,
        receipt: receiptAddress,
        startedAt: startedAt.toNumber(),
      })
      const statusCheck =
        !!state && statusKey !== ALL ? [statusKey].includes(state) : true

      return mintCheck && statusCheck
    },
    [fetchAirdropStatus, mintKey, statusKey],
  )

  const filterListReceive = useCallback(async () => {
    let filteredData: ReceiveItem[] = []
    for (const itemReceive of listReceive) {
      const state = await validReceiveItem(itemReceive)
      if (state) filteredData.push(itemReceive)
    }

    if (!filteredData.length) onFilter([])
    return onFilter(filteredData)
  }, [validReceiveItem, listReceive, onFilter])

  useEffect(() => {
    filterListReceive()
  }, [filterListReceive])

  return (
    <Space>
      <SelectExistMintToken
        mintAddresses={listMintAddr}
        onChange={setMintKey}
      />
      <SelectTokenByStatus onChange={setStatusKey} />
    </Space>
  )
}

export default FilterReceiveList
