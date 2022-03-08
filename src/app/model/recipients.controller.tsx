import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type TransferData = Array<[string, string, string]>
export type RecipientInfo = {
  walletAddress: string
  email: string
  amount: number
}

export type RecipientsInfo = Record<string, RecipientInfo>

export type Recipients = {
  recipients: RecipientsInfo
}
/**
 * Store constructor
 */

const NAME = 'recipients'
const initialState: Recipients = {
  recipients: {},
}

/**
 * Actions
 */
export const addRecipients = createAsyncThunk<
  Recipients,
  { recipients: RecipientsInfo },
  { state: any }
>(`${NAME}/addRecipients`, async ({ recipients }, { getState }) => {
  return { recipients }
})

export const addRecipient = createAsyncThunk<
  Recipients,
  { recipient: RecipientInfo },
  { state: any }
>(`${NAME}/addRecipient`, async ({ recipient }, { getState }) => {
  const {
    recipients: { recipients },
  } = getState()

  const { walletAddress } = recipient
  const newRecipients = { ...recipients }
  newRecipients[walletAddress] = recipient

  return { recipients: newRecipients }
})

export const mergeRecipient = createAsyncThunk<
  Recipients,
  { recipient: RecipientInfo },
  { state: any }
>(`${NAME}/mergeRecipient`, async ({ recipient }, { getState }) => {
  const {
    recipients: { recipients },
  } = getState()

  const { walletAddress, amount: newAmount, email: newEmail } = recipient
  const newRecipients = { ...recipients }

  const { amount: oldAmount, email: oldEmail } = newRecipients[walletAddress]
  const amount = Number(oldAmount) + Number(newAmount)
  newRecipients[walletAddress] = {
    ...newRecipients[walletAddress],
    email: oldEmail || newEmail,
    amount,
  }

  return { recipients: newRecipients }
})

export const removeRecipients = createAsyncThunk(
  `${NAME}/removeRecipients`,
  async () => {
    return { recipients: {} }
  },
)

export const deleteRecipient = createAsyncThunk(
  `${NAME}/deleteRecipient`,
  async ({ walletAddress }: { walletAddress: string }) => {
    return { walletAddress }
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
        addRecipients.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        addRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        mergeRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        removeRecipients.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deleteRecipient.fulfilled,
        (state, { payload }) =>
          void delete state.recipients[payload.walletAddress],
      ),
})

export default slice.reducer
