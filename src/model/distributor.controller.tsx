import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DistributorData } from '@sentre/utility'
import configs from 'configs'

const {
  sol: { utility },
} = configs

/**
 * Interface & Utility
 */
export type DistributorState = Record<string, DistributorData>

/**
 * Store constructor
 */

const NAME = 'distributor'
const initialState: DistributorState = {}

/**
 * Actions
 */

export const getDistributor = createAsyncThunk<
  DistributorState,
  { address: string },
  { state: any }
>(`${NAME}/getDistributor`, async ({ address }, { getState }) => {
  const { distributors } = getState()
  if (distributors[address]) return { [address]: distributors[address] }

  const { account } = utility.program
  const distributorData = await account.distributor.fetch(address)
  return { [address]: distributorData }
})

export const getDistributors = createAsyncThunk(
  `${NAME}/getDistributors`,
  async () => {
    const { account } = utility.program
    let bulk: DistributorState = {}
    const distributors = await account.distributor.all()
    for (const { publicKey, account: distributorData } of distributors) {
      const address = publicKey.toBase58()
      bulk[address] = distributorData
    }
    return bulk
  },
)

export const upsetDistributor = createAsyncThunk<
  DistributorState,
  { address: string; distributorData: DistributorData }
>(`${NAME}/upsetDistributor`, ({ address, distributorData }) => {
  return { [address]: distributorData }
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
        getDistributors.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        getDistributor.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetDistributor.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
