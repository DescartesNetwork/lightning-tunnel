import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { AppState } from 'app/model'
import { RecipientInfo } from 'app/model/recipients.controller'
import { RecipientFileType } from 'app/constants'

const useFilteredAirdropRecipient = ({ type }: { type: RecipientFileType }) => {
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )
  const listRecipient = useMemo(() => {
    let nextRecipient: RecipientInfo[] = []
    for (const address in recipientInfos) {
      if (!account.isAddress(address) && type === RecipientFileType.valid)
        continue
      if (account.isAddress(address) && type === RecipientFileType.invalid)
        continue

      nextRecipient = nextRecipient.concat(recipientInfos[address])
    }
    return nextRecipient
  }, [recipientInfos, type])

  return listRecipient
}

export default useFilteredAirdropRecipient
