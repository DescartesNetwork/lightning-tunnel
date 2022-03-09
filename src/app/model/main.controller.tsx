import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */
export type MethodType = {
  methodSelected?: number
  mintSelected: string
  fileName?: string
  selectedFile?: number[]
}

/**
 * Store constructor
 */

const NAME = 'main'
const initialState: MethodType = {
  methodSelected: undefined,
  mintSelected: '',
  fileName: '',
  selectedFile: [],
}

/**
 * Actions
 */

export const onSelectMethod = createAsyncThunk(
  `${NAME}/onSelectMethod`,
  async (methodSelected?: number) => {
    return { methodSelected }
  },
)

export const setFileName = createAsyncThunk(
  `${NAME}/setFileName`,
  async (fileName: string) => {
    return { fileName }
  },
)

export const onSelectedMint = createAsyncThunk(
  `${NAME}/onSelectedMint`,
  async (mintSelected: string) => {
    return { mintSelected }
  },
)

export const onSelectedFile = createAsyncThunk<
  Partial<MethodType>,
  {
    checked: boolean
    index?: number
  },
  { state: any }
>(`${NAME}/onSelectedFile`, async ({ checked, index }, { getState }) => {
  const {
    main: { selectedFile },
    recipients: { recipients, errorDatas },
  } = getState()

  // on select all
  if (!index) {
    const nextRecipients = [...recipients]
    const nextErrorDatas = [...(errorDatas || [])]
    if (!checked) return { selectedFile: [] }
    const selectedAll = []
    for (const idx in nextRecipients) selectedAll.push(Number(idx))
    for (const idxError in nextErrorDatas)
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
        onSelectMethod.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setFileName.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        onSelectedMint.fulfilled,
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
