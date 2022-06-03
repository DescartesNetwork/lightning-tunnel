import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'app/model/devTools'

import main from 'app/model/main.controller'
import steps from 'app/model/steps.controller'
import setting from 'app/model/setting.controller'
import recipients from 'app/model/recipients.controller'
import file from 'app/model/file.controller'
import history from 'app/model/history.controller'

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
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
