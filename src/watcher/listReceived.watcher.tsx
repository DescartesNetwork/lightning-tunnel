import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from 'model'
import { fetchListReceived } from 'model/listReceived.controller'

const ListReceivedWatcher = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const dispatch = useDispatch<AppDispatch>()

  const fetchMyListReceived = useCallback(() => {
    return dispatch(fetchListReceived({ distributors }))
  }, [dispatch, distributors])

  useEffect(() => {
    fetchMyListReceived()
  }, [fetchMyListReceived])

  return <Fragment />
}

export default ListReceivedWatcher
