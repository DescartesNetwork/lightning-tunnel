import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MerkleDistributor } from '@sentre/utility'
import { BN } from '@project-serum/anchor'

import { AppState } from 'model'
import useReceipts from './useReceipts'
import { useGetMetadata } from './metadata/useGetMetadata'

type Unclaimed = {
  amount: BN
  authority: string
  mintAddress: string
}

export const useUnclaimedList = (distributorAddress: string) => {
  const [unclaimed, setUnclaimed] = useState<Unclaimed[]>([])
  const mint = useSelector(
    (state: AppState) => state.distributors[distributorAddress].mint,
  )
  const receipts = useReceipts({ distributorAddress })
  const getMetaData = useGetMetadata()

  const checkIsClaimed = useCallback(
    (salt: Buffer) => {
      for (const address in receipts) {
        const { salt: receiptSalt } = receipts[address]
        if (!Buffer.compare(Buffer.from(receiptSalt), salt)) return true
      }
      return false
    },
    [receipts],
  )

  const getUnclaimedList = useCallback(async () => {
    try {
      const { data: bufTreeData } = await getMetaData(distributorAddress)
      const merkleDistributor = MerkleDistributor.fromBuffer(
        Buffer.from(bufTreeData),
      )
      const listUnclaimed: Unclaimed[] = []
      const recipients = merkleDistributor.receipients
      for (const { authority, amount, salt } of recipients) {
        const isClaimed = checkIsClaimed(salt)
        if (isClaimed) continue
        listUnclaimed.push({
          amount,
          authority: authority.toBase58(),
          mintAddress: mint.toBase58(),
        })
      }
      return setUnclaimed(listUnclaimed)
    } catch (error) {}
  }, [checkIsClaimed, distributorAddress, getMetaData, mint])

  useEffect(() => {
    getUnclaimedList()
  }, [getUnclaimedList])

  return { unclaimed }
}
