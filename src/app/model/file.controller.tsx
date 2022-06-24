import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */
export type FileState = {
  fileName?: string
  selectedFile: string[]
}

/**
 * Store constructor
 */

const NAME = 'file'
const initialState: FileState = {
  fileName: '',
  selectedFile: [],
}

/**
 * Actions
 */

export const setFileName = createAsyncThunk(
  `${NAME}/setFileName`,
  async (fileName: string) => {
    return { fileName }
  },
)

export const selectRecipient = createAsyncThunk<
  Partial<FileState>,
  { checked: boolean; walletAddress: string },
  { state: any }
>(
  `${NAME}/selectRecipient`,
  async ({ checked, walletAddress }, { getState }) => {
    const selectedFile = getState().file.selectedFile
    const nextSelected = [...selectedFile]
    if (!checked) {
      const indexOf = nextSelected.indexOf(walletAddress)
      nextSelected.splice(indexOf, 1)
    }
    if (checked) nextSelected.push(walletAddress)
    return { selectedFile: nextSelected }
  },
)

export const removeSelectedFile = createAsyncThunk(
  `${NAME}/removeSelectedFile`,
  async () => {
    return { selectedFile: [] }
  },
)
export const selectAllRecipient = createAsyncThunk(
  `${NAME}/selectAll`,
  async (selectedFile: string[]) => {
    return { selectedFile }
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
        setFileName.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        selectRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        removeSelectedFile.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        selectAllRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
