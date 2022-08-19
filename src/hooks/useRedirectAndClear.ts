import { useDispatch } from 'react-redux'

import { AppDispatch } from 'model'
import { onSelectStep } from 'model/steps.controller'
import {
  removeRecipients,
  setExpiration,
  setGlobalUnlockTime,
} from 'model/recipients.controller'
import { onSelectedMint, setTGE, setTGETime } from 'model/main.controller'
import { useAppRouter } from 'hooks/useAppRoute'
import { Step } from '../constants'
import { EMPTY_SELECT_VAL } from 'components/selectTokens'

export const useRedirectAndClear = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { pushHistory } = useAppRouter()

  const onPushAndClear = async (url: string) => {
    await dispatch(onSelectStep(Step.SelectMethod))
    await dispatch(removeRecipients())
    await dispatch(onSelectStep(Step.SelectMethod))
    await dispatch(setGlobalUnlockTime(0))
    await dispatch(setExpiration(0))
    await dispatch(setTGE(''))
    await dispatch(setTGETime(0))
    await dispatch(onSelectedMint(EMPTY_SELECT_VAL))
    return pushHistory(url)
  }

  return { onPushAndClear }
}
