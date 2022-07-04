import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Step } from '../constants'

/**
 * Interface & Utility
 */

export type StepState = {
  step: number
}

/**
 * Store constructor
 */

const NAME = 'steps'
const initialState: StepState = {
  step: Step.SelectMethod,
}

/**
 * Actions
 */

export const onSelectStep = createAsyncThunk(
  `${NAME}/onSelectStep`,
  async (step: number) => {
    return { step }
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
      onSelectStep.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
