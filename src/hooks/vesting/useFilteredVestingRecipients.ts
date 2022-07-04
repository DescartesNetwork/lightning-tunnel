import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'
import { RecipientInfo } from 'model/recipients.controller'
import { account } from '@senswap/sen-js'
import { RecipientFileType } from '../../constants'

export type VestingItem = {
  address: string
  config: Array<{
    unlockTime: number
    amount: string
  }>
}

const useFilteredVestingRecipient = ({ type }: { type: RecipientFileType }) => {
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )
  const listRecipient = useMemo(() => {
    let nextRecipient: RecipientInfo[] = []
    const vestingList: VestingItem[] = []
    for (const address in recipientInfos) {
      if (account.isAddress(address) && type === RecipientFileType.invalid)
        continue
      if (!account.isAddress(address) && type === RecipientFileType.valid)
        continue
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
  }, [recipientInfos, type])

  return listRecipient
}

export default useFilteredVestingRecipient
