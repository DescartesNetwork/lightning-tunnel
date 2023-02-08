import { useCallback } from 'react'
import { MerkleDistributor } from '@sentre/utility'

import { TypeDistribute } from 'model/main.controller'

import configs from 'configs'
import { useGetMetadata } from './metadata/useGetMetadata'

const {
  manifest: { appId },
} = configs

function parseMerkleType(merkle: MerkleDistributor): TypeDistribute {
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
  const getMetaData = useGetMetadata()

  const getMerkle = useCallback(
    async (distributorAddress: string) => {
      // Fetch meta data
      const { data } = await getMetaData(distributorAddress)
      // Build result data
      let root = MerkleDistributor.fromBuffer(Buffer.from([]))
      try {
        root = MerkleDistributor.fromBuffer(Buffer.from(data))
      } catch (error) {}

      return {
        root,
        type: parseMerkleType(root),
        metadata: data,
      }
    },
    [getMetaData],
  )

  return getMerkle
}
