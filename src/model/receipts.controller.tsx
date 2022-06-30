import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'

import configs from 'configs'
import { ReceiptData } from '@sentre/utility'

const {
  sol: { utility },
} = configs

/**
 * Interface & Utility
 */

export type ReceiptState = Record<string, ReceiptData>

/**
 * Store constructor
 */

const NAME = 'Receipts'
const initialState: ReceiptState = {}

/**
 * Actions
 */

export const getReceipts = createAsyncThunk(
  `${NAME}/getReceipts`,
  async ({ authorityAddress }: { authorityAddress: string }) => {
    if (!account.isAddress(authorityAddress)) throw new Error('Invalid address')

    const receipts = await utility.program.account.receipt.all([
      {
        memcmp: {
          offset: 8,
          bytes: authorityAddress,
        },
      },
    ])
    let bulk: ReceiptState = {}
    for (const receipt of receipts)
      bulk[receipt.publicKey.toBase58()] = receipt.account
    return bulk
  },
)

export const upsetReceipt = createAsyncThunk<
  ReceiptState,
  { address: string; receipt: ReceiptData }
>(`${NAME}/upsetReceipt`, ({ address, receipt }) => {
  return { [address]: receipt }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        getReceipts.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetReceipt.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
