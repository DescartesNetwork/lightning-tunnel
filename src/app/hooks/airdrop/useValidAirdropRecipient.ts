import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'
import { RecipientInfo } from 'app/model/recipients.controller'
import { account } from '@senswap/sen-js'

const useValidRecipient = () => {
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )
  const listRecipient = useMemo(() => {
    const nextRecipient: RecipientInfo[] = []
    for (const address in recipientInfos) {
      if (!account.isAddress(address)) continue
      nextRecipient.push(recipientInfos[address][0])
    }
    return nextRecipient
  }, [recipientInfos])

  return listRecipient
}

export default useValidRecipient
