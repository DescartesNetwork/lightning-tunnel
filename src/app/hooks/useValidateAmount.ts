import { account } from '@senswap/sen-js'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'
import { RecipientInfo } from 'app/model/recipients.controller'

const useValidateAmount = (listRecipient: RecipientInfo[]) => {
  const {
    setting: { decimal },
  } = useSelector((state: AppState) => state)

  const amountError = useMemo(() => {
    for (const { address, amount } of listRecipient) {
      if (!account.isAddress(address)) return true
      if (!decimal && Number(amount) % 1 !== 0) return true
    }
    return false
  }, [decimal, listRecipient])

  return { amountError }
}

export default useValidateAmount
