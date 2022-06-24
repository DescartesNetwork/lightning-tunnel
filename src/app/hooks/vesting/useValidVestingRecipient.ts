import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { AppState } from 'app/model'
import { RecipientInfo } from 'app/model/recipients.controller'

export type ValidVestingRecipient = {
  address: string
  config: Array<{
    unlockTime: number
    amount: string
  }>
}

const useValidVestingRecipient = () => {
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )
  const listRecipient = useMemo(() => {
    let nextRecipient: RecipientInfo[] = []
    const vestingList: ValidVestingRecipient[] = []
    for (const address in recipientInfos) {
      if (!account.isAddress(address)) continue
      nextRecipient = nextRecipient.concat(recipientInfos[address])
    }
    for (const { address, amount, unlockTime } of nextRecipient) {
      const index = vestingList.findIndex(
        ({ address: walletAddress }) => walletAddress === address,
      )
      if (index !== -1) {
        const data = { ...vestingList[index] }
        data.config.push({ unlockTime, amount })
        vestingList[index] = data
        continue
      }
      vestingList.push({ address, config: [{ unlockTime, amount }] })
    }
    return vestingList
  }, [recipientInfos])

  return listRecipient
}

export default useValidVestingRecipient
