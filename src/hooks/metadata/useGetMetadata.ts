import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { encode } from 'bs58'

import { AppState } from 'model'
import { MetadataBackup } from 'helper/aws'

export const useGetMetadata = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const metadatas = useSelector((state: AppState) => state.metadatas)

  const getMetaData = useCallback(
    (distributorAddress: string) => {
      const { metadata } = distributors[distributorAddress]
      let cid = encode(Buffer.from(metadata))
      if (MetadataBackup[distributorAddress])
        cid = MetadataBackup[distributorAddress]

      if (!metadatas[cid]) return { data: [], createAt: 0, checked: false }
      return metadatas[cid]
    },
    [distributors, metadatas],
  )

  return getMetaData
}
