import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'
import { Leaf, MerkleDistributor } from '@sentre/utility'

import { AppState } from 'app/model'
import { getCID } from 'app/helper'
import IPFS from 'shared/pdb/ipfs'
import configs from 'app/configs'
import { TypeDistribute } from '../model/main.controller'

const {
  manifest: { appId },
  sol: { utility },
} = configs

export type ReceiveItem = {
  sender: string
  mintAddress: string
  distributorAddress: string
  receiptAddress: string
  recipientData: Leaf
  children?: ReceiveItem[]
}

const useReceiveList = ({ type }: { type: TypeDistribute }) => {
  const [receiveList, setReceiveList] = useState<ReceiveItem[]>([])
  const [loading, setLoading] = useState(true)

  const distributors = useSelector((state: AppState) => state.distributors)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const fetchListAirdrop = useCallback(async () => {
    const listAirdrop: ReceiveItem[] = []
    const ipfs = new IPFS()
    const listDistributor = Object.keys(distributors).map((address) => ({
      address,
      ...distributors[address],
    }))
    try {
      await Promise.all(
        listDistributor.map(
          async ({ metadata, mint, authority, address }, index) => {
            try {
              setLoading(true)
              const cid = await getCID(metadata)
              const data = await ipfs.get(cid)
              const merkleDistributor = MerkleDistributor.fromBuffer(
                Buffer.from(data),
              )
              const recipients = merkleDistributor.recipients
              const mintAddress = mint.toBase58()
              const sender = authority.toBase58()
              //filter airdrop-type distributes

              const airdropSalt = MerkleDistributor.salt(
                `${appId}/${type}/${0}`,
              )
              if (Buffer.compare(airdropSalt, recipients[0].salt) !== 0) return
              for (const recipient of recipients) {
                const { authority, salt } = recipient
                if (walletAddress === authority.toBase58()) {
                  const receiptAddress = await utility.deriveReceiptAddress(
                    salt,
                    address,
                  )
                  const airdropItem: ReceiveItem = {
                    mintAddress,
                    sender,
                    distributorAddress: address,
                    receiptAddress,
                    recipientData: recipient,
                  }

                  listAirdrop.push(airdropItem)
                }
              }
            } catch (error) {}
          },
        ),
      )
    } catch (error) {
    } finally {
      setReceiveList(listAirdrop)
      return setLoading(false)
    }
  }, [distributors, type, walletAddress])

  useEffect(() => {
    fetchListAirdrop()
  }, [fetchListAirdrop])

  return { receiveList, loading }
}

export default useReceiveList
