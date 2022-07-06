import { useCallback, useEffect, useMemo, useState } from 'react'
import { account } from '@senswap/sen-js'

import { Space } from 'antd'
import SelectExistMintToken from './selectExistMintToken'
import SelectTokenByTime from './selectTokenByTime'

import { ItemSent } from 'hooks/useSentList'
import { ALL, ONE_DAY } from '../constants'

type FilterSentListProps = {
  listSent: ItemSent[]
  onFilter: (data: ItemSent[]) => void
}
const FilterSentList = ({ listSent, onFilter }: FilterSentListProps) => {
  const [mintKey, setMintKey] = useState(ALL)
  const [timeKey, setTimeKey] = useState(ALL)

  const listMintAddr = useMemo(() => {
    if (!listSent.length) return []
    let mints: string[] = []
    for (const item of listSent) {
      const { mint: mintAddress } = item
      if (!mints.includes(mintAddress)) mints.push(mintAddress)
    }
    return mints
  }, [listSent])

  const validSentItem = useCallback(
    (itemSent: ItemSent) => {
      const { time, mint: mintAddress } = itemSent
      const createAt = Number(new Date(time))

      const mintCheck =
        account.isAddress(mintAddress) && mintKey !== ALL
          ? [mintKey].includes(mintAddress)
          : true

      const timeCheck =
        !!createAt && timeKey !== ALL
          ? Date.now() - createAt < Number(timeKey) * ONE_DAY
          : true

      return mintCheck && timeCheck
    },
    [mintKey, timeKey],
  )

  const filteredListSent = useMemo(() => {
    const filteredData = listSent.filter((itemSent) => validSentItem(itemSent))
    if (!filteredData.length) return []
    return filteredData
  }, [validSentItem, listSent])

  useEffect(() => {
    onFilter(filteredListSent)
  }, [filteredListSent, onFilter])

  return (
    <Space>
      <SelectExistMintToken
        mintAddresses={listMintAddr}
        onChange={setMintKey}
      />
      <SelectTokenByTime onChange={setTimeKey} />
    </Space>
  )
}

export default FilterSentList
