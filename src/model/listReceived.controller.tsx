import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Leaf, MerkleDistributor } from '@sentre/utility'

import { ipfs } from 'helper/ipfs'
import { DistributorState } from './distributor.controller'
import configs from 'configs'

const {
  sol: { utility },
} = configs

/**
 * Interface & Utility
 */

export type ReceiveItem = {
  sender: string
  mintAddress: string
  distributorAddress: string
  receiptAddress: string
  recipientData: Leaf
  index: number
  children?: ReceiveItem[]
}

export type ListReceivedState = {
  listReceived: Record<string, ReceiveItem> | undefined
}

/**
 * Store constructor
 */

const NAME = 'listReceived'
const initialState: ListReceivedState = {
  listReceived: undefined,
}

/**
 * Actions
 */

export const fetchListReceived = createAsyncThunk<
  ListReceivedState,
  { distributors: DistributorState },
  { state: any }
>(`${NAME}/fetchListReceived`, async ({ distributors }, { getState }) => {
  const { metadatas } = getState()

  let bulk: Record<string, ReceiveItem> | undefined
  const listDistributor = Object.keys(distributors).map((address) => ({
    address,
    ...distributors[address],
  }))
  const walletAddress = await window.sentre.wallet.getAddress()
  if (!walletAddress) throw new Error('Please connect wallet first!')

  await Promise.all(
    listDistributor.map(async ({ metadata, mint, authority, address }) => {
      try {
        const cid = ipfs.decodeCID(metadata)
        const bufTreeData = metadatas[cid]
        const merkleDistributor = MerkleDistributor.fromBuffer(
          Buffer.from(bufTreeData),
        )
        const recipients = merkleDistributor.receipients
        const mintAddress = mint.toBase58()
        const sender = authority.toBase58()

        for (let i = 0; i < recipients.length; i++) {
          bulk = bulk ? { ...bulk } : {} // clone data to avoid undefined
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
            if (bulk?.[address]) {
              const { children } = bulk[address]
              let listChildren: ReceiveItem[] = []
              if (!children) listChildren = [{ ...bulk[address] }] //add current data to children if vesting
              if (children) listChildren = [...children]
              listChildren.push(receiveItem)
              bulk[address].children = listChildren
              continue
            }
            bulk[address] = receiveItem
          }
        }
      } catch (error) {}
    }),
  )

  return { listReceived: bulk }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      fetchListReceived.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
