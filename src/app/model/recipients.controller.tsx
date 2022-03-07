import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'

/**
 * Interface & Utility
 */

export type RecipientInfo = {
  walletAddress: string
  email: string
  amount: number
}

export type Recipients = {
  recipients: Record<string, RecipientInfo>
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
  { recipients: Record<string, RecipientInfo> },
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

  const { walletAddress, amount: newAmount } = recipient
  const newRecipients = { ...recipients }

  const { amount: oldAmount } = newRecipients[walletAddress]
  const amount = Number(oldAmount) + Number(newAmount)
  newRecipients[walletAddress] = {
    ...newRecipients[walletAddress],
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
    if (!account.isAddress(walletAddress))
      throw new Error('Invalid order address')
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
