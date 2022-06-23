import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { AppState } from 'app/model'
import useMintDecimals from 'shared/hooks/useMintDecimals'

const FIRST_RECIPIENT = 0

const useTotal = () => {
  const {
    main: { mintSelected },
    recipients: { recipientInfos },
    setting: { decimal: isDecimal },
  } = useSelector((state: AppState) => state)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const calcTotalLamports = useCallback(() => {
    if (!recipientInfos || !mintDecimals) return BigInt(0)
    let lamports = BigInt(0)
    const listRecipient = Object.values(recipientInfos)
    for (const recipient of listRecipient) {
      const amount =
        Number(recipient[FIRST_RECIPIENT].amount) * recipient.length
      if (isDecimal) lamports += utils.decimalize(amount, mintDecimals)
      else if (Number(amount) % 1 === 0) lamports += BigInt(amount)
    }

    return lamports
  }, [isDecimal, mintDecimals, recipientInfos])

  const recipientTotal = calcTotalLamports()

  const quantity = useMemo(
    () => Object.keys(recipientInfos).length,
    [recipientInfos],
  )

  return {
    total: utils.undecimalize(recipientTotal, mintDecimals).toString(),
    quantity,
  }
}

export default useTotal
