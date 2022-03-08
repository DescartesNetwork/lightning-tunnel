import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { account } from '@senswap/sen-js'

/**
 * Interface & Utility
 */

export type RecipientInfo = [string, string, number]

export type RecipientInfos = Array<RecipientInfo>

export type Recipients = {
  recipients: RecipientInfos
}
/**
 * Store constructor
 */

const NAME = 'manual'
const initialState: Recipients = {
  recipients: [],
}

// /**
//  * Actions
//  */
// export const addRecipients = createAsyncThunk<
//   Recipients,
//   { recipients: Record<string, RecipientInfo> },
//   { state: any }
// >(`${NAME}/addRecipients`, async ({ recipients }, { getState }) => {
//   return { recipients }
// })

export const addRecipient = createAsyncThunk<
  Recipients,
  { recipient: RecipientInfo },
  { state: any }
>(`${NAME}/addRecipient`, async ({ recipient }, { getState }) => {
  const {
    manual: { recipients },
  } = getState()

  const newRecipients = [...recipients]
  newRecipients.push(recipient)

  return { recipients: newRecipients }
})

export const getRecipient = createAsyncThunk<
  Recipients,
  { address: string },
  { state: any }
>(`${NAME}/getRecipient`, ({ address }, { getState }) => {
  const {
    manual: { recipients },
  } = getState()
  const recipient = recipients.find(([walletAddress]: any) => {
    return address === walletAddress
  })

  return recipient
})

// export const mergeRecipient = createAsyncThunk<
//   Recipients,
//   { recipient: RecipientInfo },
//   { state: any }
// >(`${NAME}/mergeRecipient`, async ({ recipient }, { getState }) => {
//   const {
//     recipients: { recipients },
//   } = getState()

//   const { walletAddress, amount: newAmount } = recipient
//   const newRecipients = { ...recipients }

//   const { amount: oldAmount } = newRecipients[walletAddress]
//   const amount = Number(oldAmount) + Number(newAmount)
//   newRecipients[walletAddress] = {
//     ...newRecipients[walletAddress],
//     amount,
//   }

//   return { recipients: newRecipients }
// })

// export const deleteRecipient = createAsyncThunk(
//   `${NAME}/deleteRecipient`,
//   async ({ walletAddress }: { walletAddress: string }) => {
//     if (!account.isAddress(walletAddress))
//       throw new Error('Invalid order address')
//     return { walletAddress }
//   },
// )

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      addRecipient.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
