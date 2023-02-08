import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Net, net } from '@sentre/senhub'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import axios from 'axios'

import { toFilename } from 'helper/cid'
import { AppState } from 'model'
import { DEV_NET_METADATA } from 'constants/oldData.devnet'
import { MAIN_NET_METADATA } from 'constants/oldData.mainnet'
import configs from 'configs'

const metadataData: Record<Net, Record<string, string>> = {
  mainnet: MAIN_NET_METADATA,
  devnet: DEV_NET_METADATA,
  testnet: DEV_NET_METADATA,
}

export const useGetMetadata = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const getMetaData = useCallback(
    async (distributorAddress: string) => {
      let cid = metadataData[net][distributorAddress]
      if (!cid) {
        const { metadata } = distributors[distributorAddress]
        cid = bs58.encode(Buffer.from(metadata))
      }
      const fileName = toFilename(cid)
      const url = configs.api.aws + fileName
      const { data } = await axios.get(url)

      return { data: data.data }
    },
    [distributors],
  )

  return getMetaData
}
