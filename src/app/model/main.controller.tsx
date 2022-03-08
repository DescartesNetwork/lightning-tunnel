import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */
export type TransferData = Array<[string, string, string]>
export enum Status {
  None,
  Estimating,
  Estimated,
  Sending,
  Done,
}
export type MethodType = {
  methodSelected?: number
  status: Status
  mintSelected: string
  fileName?: string
  data: TransferData /* address, amount */
}

/**
 * Store constructor
 */

const NAME = 'main'
const initialState: MethodType = {
  methodSelected: undefined,
  status: Status.None,
  mintSelected: '',
  fileName: '',
  data: [],
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

export const setFileName = createAsyncThunk(
  `${NAME}/setFileName`,
  async (fileName: string) => {
    return { fileName }
  },
)

export const setDecimalized = createAsyncThunk(
  `${NAME}/setDecimalized`,
  async (decimalized: boolean) => {
    return { decimalized, status: Status.None }
  },
)

export const setStatus = createAsyncThunk(
  `${NAME}/setStatus`,
  async (status: Status) => {
    return { status }
  },
)

export const onSelectedMint = createAsyncThunk(
  `${NAME}/selectPool`,
  async (mintSelected: string) => {
    return { mintSelected }
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
        setFileName.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setStatus.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        onSelectedMint.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
