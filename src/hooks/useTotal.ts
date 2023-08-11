import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { utilsBN } from '@sen-use/web3'
import { useMintDecimals } from '@sentre/senhub'
import { BN } from '@project-serum/anchor'

import { AppState } from 'model'
import { RecipientInfo } from 'model/recipients.controller'

const useTotal = () => {
  const {
    main: { mintSelected },
    recipients: { recipientInfos, expirationTime },
    setting: { decimal: isDecimal },
  } = useSelector((state: AppState) => state)
  const mintDecimals = useMintDecimals({ mintAddress: mintSelected }) || 0

  const checkUnLockTime = useCallback(
    (recipientData: RecipientInfo[]) => {
      if (!expirationTime) return true
      for (const { unlockTime } of recipientData) {
        if (unlockTime > expirationTime) return false
      }
      return true
    },
    [expirationTime],
  )

  const recipientTotal = useMemo(() => {
    if (!recipientInfos || mintDecimals === undefined) return new BN(0)
    let lamports = new BN(0)
    let listRecipient: RecipientInfo[] = []
    for (const address in recipientInfos) {
      const validTime = checkUnLockTime(recipientInfos[address])

      if (!account.isAddress(address) || !validTime) continue
      listRecipient = listRecipient.concat(recipientInfos[address])
    }

    for (const { amount } of listRecipient) {
      if (isDecimal && !!Number(amount)) {
        lamports = lamports.add(utilsBN.decimalize(amount, mintDecimals))
      } else if (Number(amount) % 1 === 0)
        lamports = lamports.add(new BN(amount))
    }

    return lamports
  }, [checkUnLockTime, isDecimal, mintDecimals, recipientInfos])

  const quantity = useMemo(
    () => Object.keys(recipientInfos).length,
    [recipientInfos],
  )

  return {
    total: utilsBN.undecimalize(recipientTotal, mintDecimals).toString(),
    quantity,
  }
}

export default useTotal
