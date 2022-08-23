import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { MerkleDistributor } from '@sentre/utility'

import { AppDispatch } from 'model'
import { TypeDistribute } from 'model/main.controller'
import { getMetaData, ipfs } from 'model/metadatas.controller'
import { getDistributor } from 'model/distributor.controller'
import configs from 'configs'

const {
  manifest: { appId },
} = configs

function parseMerkleType(merkle: MerkleDistributor): TypeDistribute | null {
  try {
    const types = [TypeDistribute.Airdrop, TypeDistribute.Vesting]
    for (const type of types) {
      const airdropSalt_v1 = MerkleDistributor.salt('0')
      const airdropSalt_v2 = MerkleDistributor.salt(`${appId}/${type}/0`)
      const salt = merkle.receipients[0].salt
      const x1 = Buffer.compare(airdropSalt_v1, salt)
      const x2 = Buffer.compare(airdropSalt_v2, salt)

      if (x1 !== 0 && x2 !== 0) continue
      return type
    }
    return TypeDistribute.Airdrop
  } catch (error) {
    return TypeDistribute.Airdrop
  }
}

export const useGetMerkle = () => {
  const dispatch = useDispatch<AppDispatch>()

  const getMerkle = useCallback(
    async (distributorAddress: string) => {
      // Fetch distributor data
      const { [distributorAddress]: distributorData } = await dispatch(
        getDistributor({ address: distributorAddress }),
      ).unwrap()
      // Fetch meta data
      const cidString = ipfs.decodeCID(distributorData.metadata)
      const { [cidString]: metadata } = await dispatch(
        getMetaData({ cid: cidString }),
      ).unwrap()
      // Build result data
      let root = MerkleDistributor.fromBuffer(Buffer.from([]))
      try {
        root = MerkleDistributor.fromBuffer(Buffer.from(metadata.data))
      } catch (error) {}

      return {
        root,
        type: parseMerkleType(root),
        metadata,
      }
    },
    [dispatch],
  )

  return getMerkle
}
