import { useCallback, useEffect, useState } from 'react'

import { ItemSent } from 'hooks/useSentList'
import { ALL } from '../../constants'
import FilterSelection from './filterSelection'
import { useFilterSentList } from 'hooks/useFilterSentList'
import { TypeDistribute } from 'model/main.controller'

const TIME_OPTIONS = ['7', '30', '90']
const DEFAULT_SELECTION = { token: ALL, time: ALL }

type FilterSentListProps = {
  onFilter: (data: ItemSent[]) => void
  type: TypeDistribute
}
const FilterSentList = ({ onFilter, type }: FilterSentListProps) => {
  const [filterKey, setFilterKey] = useState(DEFAULT_SELECTION)
  const { filterSentList, sentMints } = useFilterSentList(type)

  const onChange = useCallback(() => {
    const senList = filterSentList({
      mintAddress: filterKey.token,
      time: filterKey.time,
    })
    onFilter(senList)
  }, [filterKey, filterSentList, onFilter])

  useEffect(() => {
    onChange()
  }, [onChange])

  return (
    <FilterSelection
      options={{ token: sentMints, time: TIME_OPTIONS }}
      onChange={(val) => setFilterKey(val as any)}
      values={filterKey}
    />
  )
}

export default FilterSentList
