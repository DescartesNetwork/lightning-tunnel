import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type Setting = {
  decimal: boolean
  encryption: boolean
}

/**
 * Store constructor
 */

const NAME = 'setting'
const initialState: Setting = {
  decimal: false,
  encryption: false,
}

/**
 * Actions
 */

export const setDecimal = createAsyncThunk(
  `${NAME}/setDecimal`,
  async (decimal: boolean) => {
    return { decimal }
  },
)

export const setEncryption = createAsyncThunk(
  `${NAME}/setEncryption`,
  async (encryption: boolean) => {
    return { encryption }
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
        setDecimal.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setEncryption.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer