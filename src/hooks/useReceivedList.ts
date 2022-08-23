import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'
import { Leaf } from '@sentre/utility'
import { isEmpty } from 'lodash'

import { AppState } from 'model'
import configs from 'configs'
import { ipfs } from 'model/metadatas.controller'
import { useGetMerkle } from './useGetMerkle'
import { TypeDistribute } from 'model/main.controller'

const {
  sol: { utility },
} = configs

export type ReceiveItem = {
  sender: string
  mintAddress: string
  distributorAddress: string
  receiptAddress: string
  recipientData: Leaf
  index: number
  children?: ReceiveItem[]
}

export type ReceivedList = Record<string, ReceiveItem>

export const useReceivedList = ({ type }: { type: TypeDistribute }) => {
  const [receivedList, setReceivedList] = useState<ReceiveItem[]>()
  const distributors = useSelector((state: AppState) => state.distributors)
  const metadatas = useSelector((state: AppState) => state.metadatas)
  const walletAddress = useWalletAddress()
  const getMerkle = useGetMerkle()

  const fetchReceivedList = useCallback(async () => {
    if (isEmpty(distributors) || isEmpty(metadatas)) return

    const bulk: ReceiveItem[] = []

    const listDistributor = Object.keys(distributors).map((address) => ({
      address,
      ...distributors[address],
    }))

    await Promise.all(
      listDistributor.map(
        async ({ metadata: digest, mint, authority, address }) => {
          try {
            const cid = ipfs.decodeCID(digest)
            const metadata = metadatas[cid]

            if (!metadata) return

            const merkle = await getMerkle(address)
            if (merkle.type !== type) return

            const recipients = merkle.root.receipients
            const mintAddress = mint.toBase58()
            const sender = authority.toBase58()

            for (let i = 0; i < recipients.length; i++) {
              const { authority, salt } = recipients[i]
              if (walletAddress === authority.toBase58()) {
                const receiptAddress = await utility.deriveReceiptAddress(
                  salt,
                  address,
                )
                const receiveItem: ReceiveItem = {
                  mintAddress,
                  sender,
                  distributorAddress: address,
                  receiptAddress,
                  recipientData: recipients[i],
                  index: i,
                }
                bulk.push(receiveItem)
              }
            }
          } catch (error) {}
        },
      ),
    )
    return setReceivedList(bulk)
  }, [distributors, getMerkle, metadatas, type, walletAddress])

  useEffect(() => {
    fetchReceivedList()
  }, [fetchReceivedList])

  return receivedList
}
