import { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@sentre/senhub'

import { AppDispatch, AppState } from 'model'
import { getHistory } from 'model/history.controller'

const HistoryWatcher = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  useEffect(() => {
    dispatch(getHistory({ walletAddress }))
  }, [dispatch, distributors, walletAddress])

  return <Fragment />
}

export default HistoryWatcher
