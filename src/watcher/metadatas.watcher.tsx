import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { encode } from 'bs58'

import { AppDispatch, AppState } from 'model'
import { getMetaData } from 'model/metadatas.controller'
import { setMetadataLoading } from 'model/main.controller'
import { MetadataBackup } from 'helper/aws'

const MetadatasWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const distributors = useSelector((state: AppState) => state.distributors)

  const watchData = useCallback(async () => {
    for (const address in distributors) {
      const { metadata } = distributors[address]
      let cid = encode(Buffer.from(metadata))
      if (MetadataBackup[address]) cid = MetadataBackup[address]
      dispatch(getMetaData({ cid }))
    }
    return dispatch(setMetadataLoading(false))
  }, [dispatch, distributors])

  useEffect(() => {
    const timeout = setTimeout(() => watchData(), 1000)
    return () => clearTimeout(timeout)
  }, [dispatch, watchData])

  return <Fragment />
}

export default MetadatasWatcher
