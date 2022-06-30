import { account } from '@senswap/sen-js'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'

const useValidateAmount = () => {
  const {
    recipients: { recipients },
    setting: { decimal },
  } = useSelector((state: AppState) => state)

  const amountError = useMemo(() => {
    for (const [address, amount] of recipients) {
      if (!account.isAddress(address)) return true
      if (!decimal && Number(amount) % 1 !== 0) return true
    }
    return false
  }, [decimal, recipients])

  return { amountError }
}

export default useValidateAmount