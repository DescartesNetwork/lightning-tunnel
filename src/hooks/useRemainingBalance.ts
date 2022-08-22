import { useMemo } from 'react'

import useTotal from './useTotal'

import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'

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
