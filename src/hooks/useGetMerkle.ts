import { useCallback } from 'react'
import { MerkleDistributor } from '@sentre/utility'

import { TypeDistribute } from 'model/main.controller'
import { useGetMetadata } from './metadata/useGetMetadata'
import configs from 'configs'

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
      const metadata = getMetaData(distributorAddress)
      // Build result data
      const root = MerkleDistributor.fromBuffer(
        Buffer.from(metadata.data || []),
      )
      return {
        root,
        type: parseMerkleType(root),
        metadata,
      }
    },
    [getMetaData],
  )

  return getMerkle
}
