import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import util from '@senswap/sen-js/dist/utils'

const useTotalTransfer = () => {
  const [quantity, setQuantity] = useState(0)
  const [total, setTotal] = useState(0)
  const {
    recipients: { recipients },
    main: { mintSelected },
    setting: { decimal },
  } = useSelector((sate: AppState) => sate)

  const mintDecimals = useMintDecimals(mintSelected) || 0

  const listRecipients = useMemo(
    () => Object.values(recipients).map((recipient) => recipient),
    [recipients],
  )

  const calculateTotal = useCallback(() => {
    let sum = 0
    for (const recipient of listRecipients) {
      sum += Number(recipient.amount)
    }
    if (decimal) return setTotal(Number(util.decimalize(sum, mintDecimals)))
    return setTotal(sum)
  }, [decimal, listRecipients, mintDecimals])

  const calculateQuantity = useCallback(() => {
    setQuantity(listRecipients.length)
  }, [listRecipients])

  useEffect(() => {
    calculateTotal()
    calculateQuantity()
  }, [calculateTotal, calculateQuantity])

  return { quantity, total }
}

export default useTotalTransfer
