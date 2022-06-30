import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'model/devTools'

import main from 'model/main.controller'
import steps from 'model/steps.controller'
import setting from 'model/setting.controller'
import recipients from 'model/recipients.controller'
import receipts from 'model/receipts.controller'
import file from 'model/file.controller'
import history from 'model/history.controller'
import distributors from 'model/distributor.controller'
import advancedMode from 'model/advancedMode.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools(process.env.REACT_APP_ID as string),
  reducer: {
    main,
    steps,
    setting,
    file,
    history,
    distributors,
    recipients,
    advancedMode,
    receipts,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
