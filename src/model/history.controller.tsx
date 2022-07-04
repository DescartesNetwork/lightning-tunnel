import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'

import History, { HistoryRecord } from 'helper/history'

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
  const history = new History('history', walletAddress)
  const data = await history.get()
  return data
})

export const setStateHistory = createAsyncThunk<
  HistoryState,
  { cid: string; state: string; walletAddress: string },
  { state: any }
>(
  `${NAME}/setStateHistory`,
  async ({ cid, state, walletAddress }, { getState }) => {
    const { history } = getState()
    const newHistory = [...history]
    const currentHistory = newHistory.find((history) => history.cid === cid)
    const index = newHistory.findIndex((history) => history.cid === cid)
    newHistory[index] = { ...currentHistory, state }

    const localHistory = new History('history', walletAddress)
    localHistory.update({ ...currentHistory, state })

    return newHistory
  },
)

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
        setStateHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
