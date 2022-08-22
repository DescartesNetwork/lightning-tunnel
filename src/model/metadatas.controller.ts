import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IPFS } from '@sen-use/app'

/**
 * IPFS configs
 */
const KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU4M0Q5MmIwMGJlNjZDNjg2NDUyY0JkNTZEMTlmOWZlMTRhNjhCYTQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTg4MDM1NjE3MTcsIm5hbWUiOiJCb29zdGVyRGV2In0.kaP_EXFB2q7Zo8_CWZfGI1n5R-AoZzfVTWpDdZ_REcM'

type MapTypes = {
  metadata: MetaData
  backupMetadata: MetadataState
}
type Idl = ['metadata', 'backupMetadata']
const IDL: Idl = ['metadata', 'backupMetadata']
export const ipfs = new IPFS<MapTypes, Idl>(KEY, IDL)

/**
 * Interface & Utility
 */
type MetaData = {
  createAt: number
  checked: boolean
  data: Buffer
}
export type MetadataState = Record<string, MetaData>

/**
 * Store constructor
 */

const NAME = 'metadatas'
const initialState: MetadataState = {}

/**
 * Actions
 */

export const getMetaData = createAsyncThunk<
  MetadataState,
  { cid: string },
  { state: any }
>(`${NAME}/getMetaData`, async ({ cid }, { getState }) => {
  // Check metadata cache
  const { metadatas } = getState()
  const cache = metadatas[cid]
  if (cache) return { [cid]: cache }
  // Fetch metadata
  let metadata: MetaData = Buffer.from([]) as any
  try {
    metadata = await ipfs.methods.metadata.get(cid)
  } catch (error) {}

  // Convert from version 1 to version 2
  if (metadata.checked === undefined || metadata.createAt === undefined) {
    return {
      [cid]: {
        checked: false,
        createAt: 0,
        data: Buffer.from(metadata as any),
      },
    }
  }
  return { [cid]: { ...metadata, data: Buffer.from(metadata.data) } }
})

export const initMetadatas = createAsyncThunk(
  `${NAME}/initMetadatas`,
  async (bulk: MetadataState) => {
    // TODO: filter
    const filteredBulk: MetadataState = {}
    for (const addr in bulk) {
      try {
        const data = Buffer.from(bulk[addr].data)
        filteredBulk[addr] = { ...bulk[addr], data }
      } catch (error) {
        console.log('error metadata====>', addr, bulk[addr].data)
      }
    }
    return filteredBulk
  },
)

export const getMetadatas = createAsyncThunk<
  MetadataState,
  void,
  { state: any }
>(`${NAME}/getMetadatas`, async (_, { getState }) => {
  const { metadatas } = getState()
  return metadatas
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
        getMetaData.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        initMetadatas.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
