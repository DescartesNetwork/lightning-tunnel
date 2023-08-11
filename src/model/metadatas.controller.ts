import axios from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toFilename } from 'helper/aws'

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

export const getMetaData = createAsyncThunk<MetadataState, { cid: string }>(
  `${NAME}/getMetaData`,
  async ({ cid }) => {
    try {
      const fileName = toFilename(cid)
      const url = 'https://sen-storage.s3.us-west-2.amazonaws.com/' + fileName
      const { data: metadata } = await axios.get(url)
      return { [cid]: { ...metadata, data: Buffer.from(metadata.data) } }
    } catch (error) {
      return {
        [cid]: {
          checked: false,
          createAt: 0,
          data: Buffer.from([]),
        },
      }
    }
  },
)
export const initMetadatas = createAsyncThunk(
  `${NAME}/initMetadatas`,
  async (bulk: MetadataState) => {
    // TODO: filter
    const filteredBulk: MetadataState = {}
    for (const addr in bulk) {
      try {
        const data = Buffer.from(bulk[addr].data)
        filteredBulk[addr] = { ...bulk[addr], data }
      } catch (error) {}
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

export const setMetadata = createAsyncThunk<
  MetadataState,
  { createAt: number; cid: string },
  { state: any }
>(`${NAME}/setMetadata`, async ({ cid, createAt }, { getState }) => {
  const { metadatas } = getState()
  const nextMetadatas = { ...metadatas }

  nextMetadatas[cid] = { ...nextMetadatas[cid], checked: true, createAt }

  return nextMetadatas
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
      )
      .addCase(
        setMetadata.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
