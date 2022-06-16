import { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'app/model'
import { getDistributors } from 'app/model/distributor.controller'

const DistributorWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getDistributors())
  }, [dispatch])

  return <Fragment />
}

export default DistributorWatcher
