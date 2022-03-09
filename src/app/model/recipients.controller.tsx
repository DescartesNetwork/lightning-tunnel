import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type RecipientInfo = [string, string, string]

export type RecipientInfos = Array<RecipientInfo>

export type Recipients = {
  recipients: RecipientInfos
  errorDatas?: RecipientInfos
}
/**
 * Store constructor
 */

const NAME = 'recipients'
const initialState: Recipients = {
  recipients: [],
  errorDatas: [],
}

/**
 * Actions
 */
export const addRecipients = createAsyncThunk<
  Recipients,
  { recipients: RecipientInfos }
>(`${NAME}/addRecipients`, async ({ recipients }) => {
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
    recipients: { recipients },
  } = getState()
  const recipient = recipients.find(([walletAddress]: any) => {
    return address === walletAddress
  })

  return recipient
})

export const removeRecipients = createAsyncThunk(
  `${NAME}/removeRecipients`,
  async () => {
    return { recipients: {} }
  },
)

export const setErrorDatas = createAsyncThunk<
  Partial<Recipients>,
  { errorDatas: RecipientInfos },
  { state: any }
>(`${NAME}/setErrorDatas`, async ({ errorDatas }, { getState }) => {
  return { errorDatas }
})

export const mergeRecipient = createAsyncThunk<
  Recipients,
  { listIndex: number[] },
  { state: any }
>(`${NAME}/mergeRecipient`, async ({ listIndex }, { getState }) => {
  const {
    recipients: { recipients },
  } = getState()
  const baseData = [...recipients]
  let mergeRecipient: RecipientInfo = ['', '', '']

  for (let i = listIndex.length - 1; i >= 0; i--)
    baseData.splice(listIndex[i], 1)

  let sum = 0

  for (const index of listIndex) {
    const [address, email, amount] = recipients[index]

    console.log(recipients[index])
    sum += Number(amount)
    mergeRecipient = [address, email, sum.toString()]
  }

  baseData.push(mergeRecipient)

  return { recipients: baseData }
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
        setErrorDatas.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        mergeRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
