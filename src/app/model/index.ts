import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'app/model/devTools'

import main from 'app/model/main.controller'
import steps from 'app/model/steps.controller'
import setting from 'app/model/setting.controller'
import recipients from 'app/model/recipients.controller'
import recipients2 from 'app/model/recipientsV2.controller'
import file from 'app/model/file.controller'
import history from 'app/model/history.controller'
import distributors from 'app/model/distributor.controller'
import vesting from 'app/model/vesting.controller'

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
    recipients,
    file,
    history,
    distributors,
    vesting,
    recipients2,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
