import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type MethodType = {
  methodSelected?: number
}

/**
 * Store constructor
 */

const NAME = 'main'
const initialState: MethodType = {
  methodSelected: undefined,
}

/**
 * Actions
 */

export const onSelectMethod = createAsyncThunk(
  `${NAME}/onSelectMethod`,
  async (method?: number) => {
    if (!method) return
    return { methodSelected: method }
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
    void builder.addCase(
      onSelectMethod.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
