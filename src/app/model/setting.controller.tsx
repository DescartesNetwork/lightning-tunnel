import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type SettingState = {
  decimal: boolean
  encryption: boolean
  disabled: boolean
}

/**
 * Store constructor
 */

const NAME = 'setting'
const initialState: SettingState = {
  decimal: true,
  encryption: false,
  disabled: false,
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

export const setDisabled = createAsyncThunk(
  `${NAME}/setDisabled`,
  async (disabled: boolean) => {
    return { disabled }
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
      )
      .addCase(
        setDisabled.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
