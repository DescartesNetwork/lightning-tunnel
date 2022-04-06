import { useMemo } from 'react'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import useTotal from './useTotal'

const useRemainingBalance = (mintAddress: string) => {
  const { balance } = useAccountBalanceByMintAddress(mintAddress)
  const { total } = useTotal()

  const remainingBalance = useMemo(() => {
    if (!balance) return 0
    return balance - Number(total)
  }, [balance, total])

  return remainingBalance
}

export default useRemainingBalance
