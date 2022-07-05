import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'
import { getCID } from 'helper'

import History, { HistoryRecord } from 'helper/history'
import IPFS from 'helper/ipfs'

/**
 * Interface & Utility
 */
export type HistoryState = HistoryRecord[]

/**
 * Store constructor
 */

const NAME = 'history'
const initialState: HistoryRecord[] = []

/**
 * Actions
 */

export const getHistory = createAsyncThunk<
  HistoryState,
  { walletAddress: string },
  { state: any }
>(`${NAME}/getHistory`, async ({ walletAddress }, { getState }) => {
  if (!account.isAddress(walletAddress))
    throw new Error('Wallet is not connected')

  const { distributors } = getState()

  const historyRecords: HistoryRecord[] = []
  const listDistributor = Object.keys(distributors).map((address) => ({
    address,
    ...distributors[address],
  }))

  const history = new History('history', walletAddress)
  const localHistory = (await history.get()) as HistoryRecord[]
  console.log(localHistory)
  if (localHistory.length) return localHistory
  const ipfs = new IPFS()
  for (const distributeData of listDistributor) {
    const { address, mint, total, metadata, authority } = distributeData
    if (authority.toBase58() !== walletAddress) continue

    const cid = await getCID(metadata)
    const treeData: Buffer = await ipfs.get(cid)
    const historyRecord: HistoryRecord = {
      distributorAddress: address,
      mint: mint.toBase58(),
      total: total.toString(),
      time: '',
      treeData,
    }
    history.append(historyRecord)
    historyRecords.push(historyRecord)
  }

  return historyRecords
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
      getHistory.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
