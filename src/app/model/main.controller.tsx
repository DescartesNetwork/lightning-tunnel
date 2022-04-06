import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { History } from 'app/constants'

/**
 * Interface & Utility
 */
export type MainState = {
  methodSelected?: number
  mintSelected: string
  visible: boolean
  currentHistory?: History
  isTyping: boolean
}

/**
 * Store constructor
 */

const NAME = 'main'
const initialState: MainState = {
  methodSelected: undefined,
  mintSelected: '',
  visible: false,
  currentHistory: undefined,
  isTyping: false,
}

/**
 * Actions
 */

export const onSelectMethod = createAsyncThunk(
  `${NAME}/onSelectMethod`,
  async (methodSelected?: number) => {
    return { methodSelected }
  },
)

export const onSelectedMint = createAsyncThunk(
  `${NAME}/onSelectedMint`,
  async (mintSelected: string) => {
    return { mintSelected }
  },
)

export const setVisible = createAsyncThunk(
  `${NAME}/setVisible`,
  async (visible: boolean) => {
    return { visible }
  },
)

export const setCurrentHistory = createAsyncThunk(
  `${NAME}/setCurrentHistory`,
  async (currentHistory: History) => {
    return { currentHistory }
  },
)

export const setIsTyping = createAsyncThunk(
  `${NAME}/setIsTyping`,
  async (isTyping: boolean) => {
    return { isTyping }
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
        onSelectMethod.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        onSelectedMint.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setVisible.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setCurrentHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setIsTyping.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
