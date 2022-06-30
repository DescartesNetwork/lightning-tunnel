import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'

import { AppState } from 'model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { RecipientInfo } from 'model/recipients.controller'

const useTotal = () => {
  const {
    main: { mintSelected },
    recipients: { recipientInfos },
    setting: { decimal: isDecimal },
  } = useSelector((state: AppState) => state)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const recipientTotal = useMemo(() => {
    if (!recipientInfos || !mintDecimals) return BigInt(0)
    let lamports = BigInt(0)
    let listRecipient: RecipientInfo[] = []
    for (const address in recipientInfos) {
      if (!account.isAddress(address)) continue
      listRecipient = listRecipient.concat(recipientInfos[address])
    }

    for (const { amount } of listRecipient) {
      if (isDecimal) lamports += utils.decimalize(amount, mintDecimals)
      else if (Number(amount) % 1 === 0) lamports += BigInt(amount)
    }

    return lamports
  }, [isDecimal, mintDecimals, recipientInfos])

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
