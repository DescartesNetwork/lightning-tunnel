import { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'model'
import { getDistributors } from 'model/distributor.controller'

const DistributorWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getDistributors())
  }, [dispatch])

  return <Fragment />
}

export default DistributorWatcher
