import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'
import { Leaf, MerkleDistributor } from '@sentre/utility'

import { AppState } from 'app/model'
import { getCID } from 'app/helper'
import IPFS from 'shared/pdb/ipfs'
import configs from 'app/configs'

const {
  manifest: { appId },
  sol: { utility },
} = configs

export type Airdrop = {
  sender: string
  mintAddress: string
  distributorAddress: string
  receiptAddress: string
  recipientData: Leaf
}

const useListAirdrop = () => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([])
  const [loading, setLoading] = useState(true)

  const distributors = useSelector((state: AppState) => state.distributors)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  console.log(distributors['E1WXUW7NdvFp8FiAB7svQXMBQpmGigrkXu1JGyUSdeKJ'])

  const fetchListAirdrop = useCallback(async () => {
    const ipfs = new IPFS()
    const cid = await getCID([
      152, 139, 103, 103, 152, 87, 163, 225, 226, 106, 165, 189, 27, 99, 166,
      251, 235, 228, 99, 208, 41, 188, 180, 93, 68, 154, 182, 143, 120, 171, 56,
      250,
    ])

    const data = await ipfs.get(cid)
    console.log(data, '23')
    const merkleDistributor = MerkleDistributor.fromBuffer(Buffer.from(data))
    console.log(merkleDistributor)
    const listAirdrop: Airdrop[] = []
    const listDistributor = Object.keys(distributors).map((address) => ({
      address,
      ...distributors[address],
    }))
    try {
      await Promise.all(
        listDistributor.map(
          async ({ metadata, mint, authority, address, total }, index) => {
            try {
              const cid = await getCID(metadata)
              const data = await ipfs.get(cid)
              const merkleDistributor = MerkleDistributor.fromBuffer(
                Buffer.from(data),
              )
              const recipients = merkleDistributor.receipients
              const mintAddress = mint.toBase58()
              const sender = authority.toBase58()
              //filter airdrop-type distributes

              const airdropSalt = MerkleDistributor.salt(
                `${appId}/airdrop/${0}`,
              )
              if (Buffer.compare(airdropSalt, recipients[0].salt) !== 0) return

              for (const recipient of recipients) {
                const { authority, salt } = recipient

                if (walletAddress === authority.toBase58()) {
                  const receiptAddress = await utility.deriveReceiptAddress(
                    salt,
                    address,
                  )
                  const airdropItem: Airdrop = {
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
      setAirdrops(listAirdrop)

      return setLoading(false)
    }
  }, [distributors, walletAddress])

  useEffect(() => {
    fetchListAirdrop()
  }, [fetchListAirdrop])

  return { airdrops, loading }
}

export default useListAirdrop
