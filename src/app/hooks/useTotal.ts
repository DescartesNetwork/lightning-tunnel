import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { AppState } from 'app/model'
import useMintDecimals from 'shared/hooks/useMintDecimals'

const useTotal = () => {
  const {
    main: { mintSelected },
    recipients: { recipients },
    setting: { decimal, disabled },
  } = useSelector((state: AppState) => state)
  const [total, setTotal] = useState<number | string>(0)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const calculateTotal = useCallback(() => {
    let sum = 0
    recipients.map((item) => {
      const amount = item[2]

      return (sum += Number(amount))
    })
    const actualAmount = decimal
      ? sum
      : utils.undecimalize(BigInt(sum), mintDecimals)
    return setTotal(actualAmount)
  }, [decimal, mintDecimals, recipients])

  const quantity = useMemo(() => recipients.length, [recipients])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  console.log(disabled)

  return { total, quantity }
}

export default useTotal
