import { useCallback, useEffect, useState } from 'react'
import { useAccounts } from '@sentre/senhub'
import { useCgk } from './useCgk'

const useTotalUSD = () => {
  const [totalUSD, setTotalUSD] = useState(0)
  const [loading, setLoading] = useState(true)
  const accounts = useAccounts()
  const { getTotalBalance } = useCgk()

  const clcTotalUSD = useCallback(async () => {
    try {
      setLoading(true)
      const totalUSD = await getTotalBalance(Object.values(accounts))
      return setTotalUSD(totalUSD)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [accounts, getTotalBalance])

  useEffect(() => {
    clcTotalUSD()
  }, [clcTotalUSD])

  return { loading, totalUSD }
}

export default useTotalUSD
