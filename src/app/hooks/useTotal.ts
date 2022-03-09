import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { AppState } from 'app/model'
import { toBigInt } from 'app/shared/utils'
import useMintDecimals from 'shared/hooks/useMintDecimals'

const useTotal = () => {
  const {
    main: { mintSelected },
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  const [total, setTotal] = useState(0)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const calculateTotal = useCallback(() => {
    let sum = 0
    recipients.map((item) => {
      const amount = item[2]
      const actualAmount = !toBigInt(amount || '')
        ? amount
        : utils.undecimalize(toBigInt(amount || ''), mintDecimals)
      return (sum += Number(actualAmount))
    })

    return setTotal(sum)
  }, [mintDecimals, recipients])

  const quantity = useMemo(() => recipients.length, [recipients])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  return { total, quantity }
}

export default useTotal
