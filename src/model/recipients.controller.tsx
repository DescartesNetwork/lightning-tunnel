import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type RecipientInfo = [string, string]

export type RecipientInfos = Array<RecipientInfo>

export type RecipientState = {
  recipients: RecipientInfos
  errorData: RecipientInfos
}
/**
 * Store constructor
 */

const NAME = 'recipients'
const initialState: RecipientState = {
  recipients: [],
  errorData: [],
}

/**
 * Actions
 */
export const addRecipients = createAsyncThunk<
  Partial<RecipientState>,
  { recipients: RecipientInfos }
>(`${NAME}/addRecipients`, async ({ recipients }) => {
  return { recipients }
})

export const addRecipient = createAsyncThunk<
  Partial<RecipientState>,
  { recipient: RecipientInfo },
  { state: any }
>(`${NAME}/addRecipient`, async ({ recipient }, { getState }) => {
  const {
    recipients: { recipients },
  } = getState()

  const newRecipients = [...recipients]
  newRecipients.push(recipient)

  return { recipients: newRecipients }
})

export const removeRecipients = createAsyncThunk(
  `${NAME}/removeRecipients`,
  async () => {
    return { recipients: [] }
  },
)

export const removeRecipient = createAsyncThunk<
  Partial<RecipientState>,
  { recipient: RecipientInfo },
  { state: any }
>(`${NAME}/removeRecipient`, async ({ recipient }, { getState }) => {
  const {
    recipients: { recipients },
  } = getState()
  const newRecipients = [...recipients]
  const index = newRecipients.indexOf(recipient)
  if (index > -1) newRecipients.splice(index, 1)
  return { recipients: newRecipients }
})

export const setErrorData = createAsyncThunk<
  Partial<RecipientState>,
  { errorData: RecipientInfos }
>(`${NAME}/setErrorDatas`, async ({ errorData }) => {
  return { errorData }
})

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
        addRecipients.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        addRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        removeRecipients.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setErrorData.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )

      .addCase(
        removeRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
