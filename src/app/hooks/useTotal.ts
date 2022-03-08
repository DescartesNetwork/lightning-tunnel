import util from '@senswap/sen-js/dist/utils'
import { AppState } from 'app/model'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useMintDecimals from 'shared/hooks/useMintDecimals'

const useTotal = () => {
  const {
    setting: { decimal },
    main: { mintSelected },
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  const [total, setTotal] = useState(0)
  const mintDecimals = useMintDecimals(mintSelected) || 0

  const calculateTotal = useCallback(() => {
    let sum = 0
    recipients.map((item) => {
      const amount = Number(item[2])
      return (sum += amount)
    })
    if (decimal) return setTotal(Number(util.decimalize(sum, mintDecimals)))
    return setTotal(sum)
  }, [decimal, mintDecimals, recipients])

  const quantity = useMemo(() => recipients.length, [recipients])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  return { total, quantity }
}

export default useTotal
