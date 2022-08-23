import { useCallback, useEffect, useState } from 'react'

import FilterSelection from './filterSelection'

import { ALL, State } from '../../constants'
import { ReceiveItem } from 'hooks/useReceivedList'
import { useFilterReceiceList } from 'hooks/useFilterReceiveList'

export const STATUS_OPTIONS = [
  State.ready,
  State.waiting,
  State.claimed,
  State.expired,
]
const DEFAULT_SELECTION = { token: ALL, status: ALL }

type FilterReceiveListProps = {
  receivedList: ReceiveItem[]
  onFilter: (data: ReceiveItem[]) => void
}
const FilterReceiveList = ({
  onFilter,
  receivedList,
}: FilterReceiveListProps) => {
  const [filterKey, setFilterKey] = useState(DEFAULT_SELECTION)
  const { filterReceiveList, getReceiveMints } =
    useFilterReceiceList(receivedList)
  const receiveMints = getReceiveMints()

  const onChange = useCallback(async () => {
    const received = await filterReceiveList({
      mintAddress: filterKey.token,
      status: filterKey.status,
    })
    onFilter(received)
  }, [filterKey, filterReceiveList, onFilter])

  useEffect(() => {
    onChange()
  }, [onChange])

  return (
    <FilterSelection
      options={{ token: receiveMints, status: STATUS_OPTIONS }}
      onChange={(val) => setFilterKey(val as any)}
      values={filterKey}
    />
  )
}

export default FilterReceiveList
