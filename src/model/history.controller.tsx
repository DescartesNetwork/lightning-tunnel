import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'
import { isEmpty } from 'lodash'

import History, { HistoryRecord } from 'helper/history'
import { ipfs } from 'helper/ipfs'
import { DistributorState } from './distributor.controller'

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
  { walletAddress: string; distributors: DistributorState }
>(`${NAME}/getHistory`, async ({ walletAddress, distributors }) => {
  if (!account.isAddress(walletAddress))
    throw new Error('Wallet is not connected')

  let listHistory: HistoryRecord[] | undefined

  const history = new History(walletAddress)
  const history_v1 = (await history.get('history')) as HistoryRecord[]

  if (history_v1) history.clear()

  const listDistributor = Object.keys(distributors).map((address) => ({
    address,
    ...distributors[address],
  }))
  await Promise.all(
    listDistributor.map(async (distributeData) => {
      try {
        listHistory = listHistory?.length ? [...listHistory] : []
        const { address, mint, total, metadata, authority } = distributeData
        if (authority.toBase58() !== walletAddress) return
        const historyLocal = (await history.get(address)) as HistoryRecord
        if (!isEmpty(historyLocal)) {
          listHistory.push(historyLocal)
          return
        }
        const treeData = await ipfs.methods.treeData.get(metadata)
        const historyRecord: HistoryRecord = {
          distributorAddress: address,
          mint: mint.toBase58(),
          total: total.toString(),
          time: '',
          treeData,
        }
        history.set(address, historyRecord)
        listHistory.push(historyRecord)
      } catch (error) {}
    }),
  )

  return { listHistory }
})

export const setHistory = createAsyncThunk<
  HistoryState,
  { historyRecord: HistoryRecord },
  { state: any }
>(`${NAME}/setHistory`, async ({ historyRecord }, { getState }) => {
  const {
    history: { listHistory },
  } = getState()

  const nextHistory = [...listHistory]
  nextHistory.unshift(historyRecord)

  return { listHistory: nextHistory }
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
        getHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
