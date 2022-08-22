import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { EMPTY_SELECT_VAL } from 'components/selectTokens'
import { Method } from '../constants'

/**
 * Interface & Utility
 */

export enum TypeDistribute {
  Vesting = 'vesting',
  Airdrop = 'airdrop',
}

export type MainState = {
  methodSelected: Method
  mintSelected: string
  visible: boolean
  isTyping: boolean
  typeDistribute: TypeDistribute
  TGE: string
  TGETime: number
}

/**
 * Store constructor
 */

const NAME = 'main'
const initialState: MainState = {
  methodSelected: Method.manual,
  mintSelected: EMPTY_SELECT_VAL,
  visible: false,
  isTyping: false,
  typeDistribute: TypeDistribute.Airdrop,
  TGE: '',
  TGETime: 0,
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
  async (type: TypeDistribute) => {
    return { typeDistribute: type }
  },
)

export const setTGE = createAsyncThunk(
  `${NAME}/setTGE`,
  async (TGE: string) => {
    return { TGE }
  },
)

export const setTGETime = createAsyncThunk(
  `${NAME}/setTGETime`,
  async (TGETime: number) => {
    return { TGETime }
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
        setTGE.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setTGETime.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
