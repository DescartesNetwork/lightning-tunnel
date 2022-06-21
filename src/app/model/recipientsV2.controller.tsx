import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DISTRIBUTE_IN_TIME } from 'app/view/vesting/addNewVesting/components/distributeIn'
import { FREQUENCY } from 'app/view/vesting/addNewVesting/components/frequency'

/**
 * Interface & Utility
 */
const ONE_DAY = 24 * 60 * 60 * 1000

export type Configs = {
  frequency: number
  distributeIn: number
}

export type RecipientInfo = {
  address: string
  amount: string
  unlockTime: number
  configs?: Configs
}

export type RecipientInfos = Record<string, Array<RecipientInfo>>

export type TreeRecipientState = {
  globalConfigs: Configs
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
  globalConfigs: {
    frequency: FREQUENCY.seven,
    distributeIn: DISTRIBUTE_IN_TIME.three,
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

export const setGlobalConfigs = createAsyncThunk<
  Partial<TreeRecipientState>,
  { configs: Partial<Configs> },
  { state: any }
>(`${NAME}/setGlobalConfigs`, async ({ configs }, { getState }) => {
  const {
    recipients: { globalConfigs },
  } = getState()

  const nextConfigs = { ...globalConfigs, ...configs }
  return { globalConfigs: nextConfigs }
})

export const addRecipient = createAsyncThunk<
  Partial<TreeRecipientState>,
  { walletAddress: string; nextRecipients: RecipientInfo[] },
  { state: any }
>(
  `${NAME}/addRecipient`,
  async ({ walletAddress, nextRecipients }, { getState }) => {
    const {
      recipients: { recipients },
    } = getState()
    const newRecipients = { ...recipients }
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
    let nextRecipients = { ...recipients.recipients }
    const listRecipient = nextRecipients[walletAddress]
    const newRecipient: RecipientInfo[] = []
    const oldAmount = Number(listRecipient[0].amount) * listRecipient.length
    const distributionAmount = Math.floor((distributeIn * 30) / frequency)
    const actualAmount = Number(oldAmount) / distributionAmount
    for (let i = 0; i < distributionAmount; i++) {
      let nextUnlockTime = 0
      if (i === 0) nextUnlockTime = unlockTime
      if (i !== 0) nextUnlockTime = 7 * ONE_DAY + newRecipient[i - 1].unlockTime
      const recipient: RecipientInfo = {
        address: walletAddress,
        amount: actualAmount.toString(),
        unlockTime: nextUnlockTime,
        configs,
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
    return { recipients: {} }
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
        addRecipient.fulfilled,
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
      ),
})

export default slice.reducer
