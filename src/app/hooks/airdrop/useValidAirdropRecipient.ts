import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { AppState } from 'app/model'
import { RecipientInfo } from 'app/model/recipients.controller'

const useValidRecipient = () => {
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )
  const listRecipient = useMemo(() => {
    let nextRecipient: RecipientInfo[] = []
    for (const address in recipientInfos) {
      if (!account.isAddress(address)) continue
      nextRecipient = nextRecipient.concat(recipientInfos[address])
    }
    return nextRecipient
  }, [recipientInfos])

  return listRecipient
}

export default useValidRecipient
