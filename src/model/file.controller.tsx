import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */
export type FileState = {
  fileName?: string
  selectedFile: number[]
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

export const onSelectedFile = createAsyncThunk<
  Partial<FileState>,
  {
    checked: boolean
    index?: number
  },
  { state: any }
>(`${NAME}/onSelectedFile`, async ({ checked, index }, { getState }) => {
  const {
    file: { selectedFile },
    recipients: { recipients, errorData },
  } = getState()

  // on select all
  if (index === undefined) {
    const nextRecipients = [...recipients]
    const nextErrorData = [...(errorData || [])]
    if (!checked) return { selectedFile: [] }
    const selectedAll = []
    for (const idx in nextRecipients) selectedAll.push(Number(idx))
    for (const idxError in nextErrorData)
      selectedAll.push(nextRecipients.length + Number(idxError))
    return { selectedFile: selectedAll }
  }

  const nextSelected = [...selectedFile]
  if (checked) nextSelected.push(index)
  else {
    const idx = nextSelected.indexOf(index)
    nextSelected.splice(idx, 1)
  }
  return { selectedFile: nextSelected }
})
export const removeSelectedFile = createAsyncThunk(
  `${NAME}/removeSelectedFile`,
  async () => {
    return { selectedFile: [] }
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
        onSelectedFile.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        removeSelectedFile.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
