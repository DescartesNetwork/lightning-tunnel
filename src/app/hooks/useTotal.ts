import { AppState } from 'app/model'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

const useTotal = () => {
  const {
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  const [total, setTotal] = useState(0)

  const calculateTotal = useCallback(() => {
    let sum = 0
    recipients.map((item) => {
      const amount = Number(item[2])
      return (sum += amount)
    })
    setTotal(sum)
  }, [recipients])

  const quantity = useMemo(() => recipients.length, [recipients])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  return { total, quantity }
}

export default useTotal
