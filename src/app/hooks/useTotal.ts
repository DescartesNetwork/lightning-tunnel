import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'

import { AppState } from 'app/model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { RecipientInfos } from 'app/model/recipients.controller'

const ADDRESS_INDEX = 0
const AMOUNT_INDEX = 1

const useTotal = () => {
  const {
    main: { mintSelected },
    recipients2: { recipients, errorData },
    setting: { decimal: isDecimal },
  } = useSelector((state: AppState) => state)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const calcTotalLamports = useCallback(
    (recipientInfos: RecipientInfos) => {
      if (!recipientInfos.length || !mintDecimals) return BigInt(0)
      let lamports = BigInt(0)
      for (const recipient of recipientInfos) {
        const amount = recipient[AMOUNT_INDEX]
        if (isDecimal) lamports += utils.decimalize(amount, mintDecimals)
        else if (Number(amount) % 1 === 0) lamports += BigInt(amount)
      }

      return lamports
    },
    [isDecimal, mintDecimals],
  )

  const editedSuccessData = errorData.filter(
    (data) => !data.includes('') && account.isAddress(data[ADDRESS_INDEX]),
  )
  const recipientTotal = calcTotalLamports(recipients)
  const editedDataTotal = calcTotalLamports(editedSuccessData)

  const total = recipientTotal + editedDataTotal
  const editedDataLength = editedSuccessData.length
  const quantity = useMemo(() => recipients.length, [recipients])

  return {
    total: utils.undecimalize(total, mintDecimals).toString(),
    quantity: quantity + editedDataLength,
  }
}

export default useTotal
