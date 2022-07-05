import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Leaf, MerkleDistributor } from '@sentre/utility'

import { getCID } from 'helper'
import IPFS from 'helper/ipfs'
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

export type ListReceivedState = Record<string, ReceiveItem>

/**
 * Store constructor
 */

const NAME = 'listReceived'
const initialState: ListReceivedState = {}

/**
 * Actions
 */

export const fetchListReceived = createAsyncThunk<
  ListReceivedState,
  { distributors: DistributorState }
>(`${NAME}/fetchListReceived`, async ({ distributors }) => {
  let bulk: ListReceivedState = {}
  const listDistributor = Object.keys(distributors).map((address) => ({
    address,
    ...distributors[address],
  }))
  const ipfs = new IPFS()
  const walletAddress = await window.sentre.wallet.getAddress()
  if (!walletAddress) throw new Error('Please connect wallet first!')

  await Promise.all(
    listDistributor.map(async ({ metadata, mint, authority, address }) => {
      try {
        const cid = await getCID(metadata)
        const data: number[] = await ipfs.get(cid)
        const merkleDistributor = MerkleDistributor.fromBuffer(
          Buffer.from(data),
        )
        const recipients = merkleDistributor.receipients
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
            if (bulk[address]) {
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

  return bulk
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
