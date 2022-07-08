import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'
import { getCID } from 'helper'

import History, { HistoryRecord } from 'helper/history'
import IPFS from 'helper/ipfs'

/**
 * Interface & Utility
 */
export type HistoryState = {
  listHistory: HistoryRecord[] | undefined
}

/**
 * Store constructor
 */

const NAME = 'history'
const initialState: HistoryState = {
  listHistory: undefined,
}

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

  let listHistory: HistoryRecord[] | undefined

  const history = new History('history', walletAddress)
  const localHistory = (await history.get()) as HistoryRecord[] | undefined
  if (localHistory && localHistory.length) return { listHistory: localHistory }

  const listDistributor = Object.keys(distributors).map((address) => ({
    address,
    ...distributors[address],
  }))
  const ipfs = new IPFS()
  await Promise.all(
    listDistributor.map(async (distributeData) => {
      const { address, mint, total, metadata, authority } = distributeData
      if (authority.toBase58() !== walletAddress) return (listHistory = [])
      listHistory = listHistory ? [...listHistory] : []
      const cid = await getCID(metadata)
      const treeData: Buffer = await ipfs.get(cid)
      if (!treeData) return
      const historyRecord: HistoryRecord = {
        distributorAddress: address,
        mint: mint.toBase58(),
        total: total.toString(),
        time: '',
        treeData,
      }
      listHistory.push(historyRecord)
    }),
  )

  if (listHistory) history.set(listHistory)
  return { listHistory }
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
