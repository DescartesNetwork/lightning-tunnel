import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'
import { RecipientInfo } from 'model/recipients.controller'

const useValidateAmount = () => {
  const decimal = useSelector((state: AppState) => state.setting.decimal)
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )

  const amountError = useMemo(() => {
    let listRecipient: RecipientInfo[] = []
    for (const address in recipientInfos) {
      listRecipient = listRecipient.concat(recipientInfos[address])
    }
    for (const { amount } of listRecipient) {
      if (!decimal && Number(amount) % 1 !== 0) return true
    }
    return false
  }, [decimal, recipientInfos])

  return { amountError }
}

export default useValidateAmount
