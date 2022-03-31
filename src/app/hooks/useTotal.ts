import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'

import { AppState } from 'app/model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { RecipientInfos } from 'app/model/recipients.controller'

const useTotal = () => {
  const {
    main: { mintSelected },
    recipients: { recipients, errorData },
    setting: { decimal },
  } = useSelector((state: AppState) => state)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const calculateTotal = (recipientInfos: RecipientInfos) => {
    if (!recipientInfos.length) return 0
    let sum = 0
    for (const recipient of recipientInfos) {
      const amount = recipient[1]
      if (Number(amount) % 1 !== 0 && !decimal) continue
      sum += Number(amount)
    }

    return sum
  }

  const editedSuccData =
    errorData?.filter((data) => {
      return !data.includes('') && account.isAddress(data[0])
    }) || []
  const recipientTotal = calculateTotal(recipients)
  const editedDataTotal = calculateTotal(editedSuccData)
  const total = recipientTotal + editedDataTotal
  const editedDataLength = editedSuccData?.length
  const quantity = useMemo(() => recipients.length, [recipients])

  return {
    total: decimal ? total : utils.undecimalize(BigInt(total), mintDecimals),
    quantity: quantity + editedDataLength,
  }
}

export default useTotal
