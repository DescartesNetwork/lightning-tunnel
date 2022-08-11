import { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { AppDispatch, AppState } from 'model'
import { getHistory } from 'model/history.controller'

const HistoryWatcher = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const dispatch = useDispatch<AppDispatch>()
  const walletAddress = useWalletAddress()

  useEffect(() => {
    dispatch(getHistory({ walletAddress, distributors }))
  }, [dispatch, walletAddress, distributors])

  return <Fragment />
}

export default HistoryWatcher
