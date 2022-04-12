import { MerkleDistributorInfo } from '@saberhq/merkle-distributor/dist/cjs/utils'

import { explorer } from 'shared/util'

export type DistributorInfo = {
  distributor: string
  distributorATA: string
}

export type ClaimProof = {
  index: number
  amount: string
  proof: any
  claimant: string
  distributorInfo?: DistributorInfo
  mintAddress: string
}

export type EncodeData = Record<string, ClaimProof>

export const notifySuccess = (content: string, txId: string) => {
  return window.notify({
    type: 'success',
    description: `${content} successfully. Click to view details.`,
    onClick: () => window.open(explorer(txId), '_blank'),
  })
}

export const notifyError = (er: any) => {
  return window.notify({
    type: 'error',
    description: er.message,
  })
}

export const encodeData = (
  tree: MerkleDistributorInfo,
  distributorInfo: DistributorInfo,
  mintAddress: string,
): EncodeData => {
  if (!tree) return {}
  const { claims } = tree
  const data: EncodeData = {}
  const listClaimant = Object.keys(claims)
  listClaimant.forEach((claimant) => {
    const { amount, index, proof } = claims[claimant]
    const newClaim = {
      index,
      proof,
      amount: amount.toString(),
      claimant,
      distributorInfo,
      mintAddress,
    }
    data[claimant] = newClaim
  })
  return data
}
