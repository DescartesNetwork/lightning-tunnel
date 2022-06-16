import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DISTRIBUTE_IN_TIME } from 'app/view/vesting/addNewVesting/components/distributeIn'
import { FREQUENCY } from 'app/view/vesting/addNewVesting/components/frequency'

/**
 * Interface & Utility
 */
export type VestingState = {
  unlockTime: number
  frequency: number
  distributeIn: number
  expiration: number
}

/**
 * Store constructor
 */

const NAME = 'vesting'
const initialState: VestingState = {
  unlockTime: 0,
  frequency: FREQUENCY.seven,
  distributeIn: DISTRIBUTE_IN_TIME.three,
  expiration: 0,
}

/**
 * Actions
 */

export const setUnlockTime = createAsyncThunk(
  `${NAME}/setUnlockTime`,
  async (unlockTime: number) => {
    return { unlockTime }
  },
)

export const setFrequency = createAsyncThunk(
  `${NAME}/setFrequency`,
  async (frequency: number) => {
    return { frequency }
  },
)
export const setDistributeIn = createAsyncThunk(
  `${NAME}/setDistributeIn`,
  async (distributeIn: number) => {
    return { distributeIn }
  },
)
export const setExpiration = createAsyncThunk(
  `${NAME}/setExpiration`,
  async (expiration: number) => {
    return { expiration }
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
        setUnlockTime.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setFrequency.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setExpiration.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setDistributeIn.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
