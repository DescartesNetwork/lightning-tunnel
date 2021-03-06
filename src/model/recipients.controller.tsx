import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import parse from 'parse-duration'

import { DISTRIBUTE_IN_TIME } from 'view/vesting/addNewVesting/components/distributeIn'
import { FREQUENCY } from 'view/vesting/addNewVesting/components/frequency'
import { CLIFF_TIME } from 'view/vesting/addNewVesting/components/cliffTime'

/**
 * Interface & Utility
 */

export type Configs = {
  frequency: string
  distributeIn: string
  cliff: string
}

export type RecipientInfo = {
  address: string
  amount: string
  unlockTime: number
}

export type RecipientInfos = Record<string, Array<RecipientInfo>>

export type TreeRecipientState = {
  configs: Configs
  recipientInfos: RecipientInfos
  expirationTime: number
  globalUnlockTime: number
}

/**
 * Store constructor
 */

const NAME = 'recipients'
const initialState: TreeRecipientState = {
  recipientInfos: {},
  expirationTime: 0,
  globalUnlockTime: 0,
  configs: {
    frequency: FREQUENCY.one,
    distributeIn: DISTRIBUTE_IN_TIME.six_months,
    cliff: CLIFF_TIME.one_months,
  },
}

/**
 * Actions
 */

export const setExpiration = createAsyncThunk(
  `${NAME}/setExpiration`,
  async (expirationTime: number) => {
    return { expirationTime }
  },
)

export const setGlobalUnlockTime = createAsyncThunk(
  `${NAME}/setGlobalUnlockTime`,
  async (globalUnlockTime: number) => {
    return { globalUnlockTime }
  },
)

export const addRecipients = createAsyncThunk<
  Partial<TreeRecipientState>,
  { recipientInfos: RecipientInfos }
>(`${NAME}/addRecipients`, async ({ recipientInfos }) => {
  return { recipientInfos }
})

export const setGlobalConfigs = createAsyncThunk<
  Partial<TreeRecipientState>,
  { configs: Partial<Configs> },
  { state: any }
>(`${NAME}/setGlobalConfigs`, async ({ configs }, { getState }) => {
  const {
    recipients: { configs: oldConfigs },
  } = getState()

  const nextConfigs = { ...oldConfigs, ...configs }
  return { configs: nextConfigs }
})

export const setRecipient = createAsyncThunk<
  Partial<TreeRecipientState>,
  { walletAddress: string; nextRecipients: RecipientInfo[] },
  { state: any }
>(
  `${NAME}/setRecipient`,
  async ({ walletAddress, nextRecipients }, { getState }) => {
    const {
      recipients: { recipientInfos },
    } = getState()
    const newRecipients = { ...recipientInfos }
    newRecipients[walletAddress] = nextRecipients

    return { recipientInfos: newRecipients }
  },
)

export const removeRecipient = createAsyncThunk(
  `${NAME}/removeRecipient`,
  async (walletAddress: string) => {
    return walletAddress
  },
)

export const editRecipient = createAsyncThunk<
  Partial<TreeRecipientState>,
  { walletAddress: string; configs: Configs; unlockTime: number },
  { state: any }
>(
  `${NAME}/editRecipient`,
  async ({ walletAddress, configs, unlockTime }, { getState }) => {
    const { recipients } = getState()
    const { distributeIn, frequency } = configs
    let nextRecipients = { ...recipients.recipientInfos }
    const listRecipient = nextRecipients[walletAddress]
    const newRecipient: RecipientInfo[] = []
    let oldAmount = 0
    for (const { amount } of listRecipient) {
      oldAmount += Number(amount)
    }
    const distributionAmount = Math.floor(
      parse(distributeIn) / parse(frequency),
    )
    const singleAmount = Number(oldAmount) / distributionAmount

    for (let i = 0; i < distributionAmount; i++) {
      let nextUnlockTime = 0
      let actualAmount = singleAmount
      if (i === 0) nextUnlockTime = unlockTime
      if (i !== 0)
        nextUnlockTime = parse(frequency) + newRecipient[i - 1].unlockTime

      if (i === distributionAmount - 1) {
        let restAmount = 0
        for (const { amount } of newRecipient) {
          restAmount += Number(amount)
        }
        actualAmount = Number(oldAmount) - restAmount
      }

      const recipient: RecipientInfo = {
        address: walletAddress,
        amount: actualAmount.toString(),
        unlockTime: nextUnlockTime,
      }
      newRecipient[i] = recipient
    }

    nextRecipients[walletAddress] = newRecipient
    return { recipientInfos: nextRecipients }
  },
)

export const removeRecipients = createAsyncThunk(
  `${NAME}/removeRecipients`,
  async () => {
    return { recipientInfos: {} }
  },
)

export const addAmountAndTime = createAsyncThunk<
  Partial<TreeRecipientState>,
  { walletAddress: string; nextRecipientInfos: RecipientInfo[] },
  { state: any }
>(
  `${NAME}/addAmountAndTime`,
  async ({ walletAddress, nextRecipientInfos }, { getState }) => {
    const {
      recipients: { recipientInfos },
    } = getState()
    const newRecipients = { ...recipientInfos }
    newRecipients[walletAddress] = nextRecipientInfos
    return { recipientInfos: newRecipients }
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
        setRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        removeRecipients.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setExpiration.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setGlobalUnlockTime.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setGlobalConfigs.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        removeRecipient.fulfilled,
        (state, { payload }) => void delete state.recipientInfos[payload],
      )
      .addCase(
        editRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        addRecipients.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        addAmountAndTime.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
