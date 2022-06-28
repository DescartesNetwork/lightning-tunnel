import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type AdvancedModeState = {
  isAdvancedMode: boolean
  listUnlockTime: number[]
}

/**
 * Store constructor
 */

const NAME = 'advancedMode'
const initialState: AdvancedModeState = {
  listUnlockTime: [],
  isAdvancedMode: false,
}

/**
 * Actions
 */

export const setAdvancedMode = createAsyncThunk(
  `${NAME}/setAdvancedMode`,
  async (isAdvancedMode: boolean) => {
    return { isAdvancedMode }
  },
)

export const setListUnlockTime = createAsyncThunk(
  `${NAME}/setListUnlockTime`,
  async (listUnlockTime: number[]) => {
    return { listUnlockTime }
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
        setAdvancedMode.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setListUnlockTime.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
