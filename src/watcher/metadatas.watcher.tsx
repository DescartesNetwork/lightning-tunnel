import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from 'model'
import { getMetaData, ipfs } from 'model/metadatas.controller'

const MetadatasWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const distributors = useSelector((state: AppState) => state.distributors)

  const watchData = useCallback(async () => {
    for (const { metadata } of Object.values(distributors)) {
      const cid = ipfs.decodeCID(metadata)
      dispatch(getMetaData({ cid }))
    }
  }, [dispatch, distributors])

  useEffect(() => {
    watchData()
  }, [dispatch, watchData])

  return <Fragment />
}

export default MetadatasWatcher
