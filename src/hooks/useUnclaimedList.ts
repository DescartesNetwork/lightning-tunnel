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
  const { mint } = useSelector(
    (state: AppState) => state.distributors[distributorAddress],
  )
  const receipts = useReceipts({ distributorAddress })
  const getMetaData = useGetMetadata()

  const getUnclaimedList = useCallback(async () => {
    try {
      const { data: bufTreeData } = getMetaData(distributorAddress)
      const merkleDistributor = MerkleDistributor.fromBuffer(
        Buffer.from(bufTreeData),
      )
      const listUnclaimed: Unclaimed[] = []
      const recipients = merkleDistributor.receipients
      for (const { authority, amount, salt } of recipients) {
        if (!receipts[authority.toBase58()]) {
          listUnclaimed.push({
            authority: authority.toBase58(),
            amount,
            mintAddress: mint.toBase58(),
          })
          continue
        }

        const receiptSalt = Buffer.from(receipts[authority.toBase58()].salt)
        if (Buffer.compare(receiptSalt, salt) !== 0)
          listUnclaimed.push({
            authority: authority.toBase58(),
            amount,
            mintAddress: mint.toBase58(),
          })
      }
      return setUnclaimed(listUnclaimed)
    } catch (error) {}
  }, [distributorAddress, getMetaData, mint, receipts])

  useEffect(() => {
    getUnclaimedList()
  }, [getUnclaimedList])

  return { unclaimed }
}
