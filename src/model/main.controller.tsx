import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SelectMethod } from '../constants'

/**
 * Interface & Utility
 */

export enum TypeDistribute {
  Vesting = 'vesting',
  Airdrop = 'airdrop',
}

export type MainState = {
  methodSelected: SelectMethod
  mintSelected: string
  visible: boolean
  isTyping: boolean
  typeDistribute: TypeDistribute
  tge: string
}

/**
 * Store constructor
 */

const NAME = 'main'
const initialState: MainState = {
  methodSelected: SelectMethod.manual,
  mintSelected: '',
  visible: false,
  isTyping: false,
  typeDistribute: TypeDistribute.Airdrop,
  tge: '',
}

/**
 * Actions
 */

export const onSelectMethod = createAsyncThunk(
  `${NAME}/onSelectMethod`,
  async (methodSelected: number) => {
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

export const setIsTyping = createAsyncThunk(
  `${NAME}/setIsTyping`,
  async (isTyping: boolean) => {
    return { isTyping }
  },
)

export const setTypeDistribute = createAsyncThunk(
  `${NAME}/setTypeDistribute`,
  async (type: string) => {
    return { typeDistribute: type }
  },
)

export const setTge = createAsyncThunk(
  `${NAME}/setTge`,
  async (tge: string) => {
    return { tge }
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
        setIsTyping.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setTypeDistribute.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setTge.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
