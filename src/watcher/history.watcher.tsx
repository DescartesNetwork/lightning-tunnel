import { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWallet } from '@sentre/senhub'

import { AppDispatch } from 'model'
import { getHistory } from 'model/history.controller'

const HistoryWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  useEffect(() => {
    dispatch(getHistory({ walletAddress }))
  }, [dispatch, walletAddress])

  return <Fragment />
}

export default HistoryWatcher
