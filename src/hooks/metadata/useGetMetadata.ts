import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'
import { ipfs } from 'model/metadatas.controller'

export const useGetMetadata = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const metadatas = useSelector((state: AppState) => state.metadatas)

  const getMetaData = useCallback(
    (distributorAddress: string) => {
      const { metadata } = distributors[distributorAddress]
      const cid = ipfs.decodeCID(metadata)
      if (!metadatas[cid]) return { data: [] }
      return metadatas[cid]
    },
    [distributors, metadatas],
  )

  return getMetaData
}
