import { useCallback } from 'react'
import { tokenProvider, useGetMintDecimals } from '@sentre/senhub'
import { utilsBN } from '@sen-use/web3'
import { BN } from '@project-serum/anchor'

import { fetchMulCGK } from 'helper'

export const useCgk = () => {
  const getDecimals = useGetMintDecimals()

  const getTotalBalance = useCallback(
    async (mintBalances: { mint: string; amount: BN | bigint }[]) => {
      const filteredMintBalances: {
        mint: string
        amount: BN
        ticket: string
      }[] = []
      // Fetch Token price
      const tickets: string[] = []
      for (const { mint, amount } of mintBalances) {
        const amountBN = new BN(amount.toString())
        const tokenInfo = await tokenProvider.findByAddress(mint)
        const ticket = tokenInfo?.extensions?.coingeckoId
        if (!ticket || amountBN.isZero()) continue
        tickets.push(ticket)
        filteredMintBalances.push({ mint, amount: amountBN, ticket })
      }
      const tokenPrices = await fetchMulCGK(tickets)
      // Calculate Total Balance
      let total = 0
      for (const {
        mint: mintAddress,
        amount,
        ticket,
      } of filteredMintBalances) {
        const decimals = (await getDecimals({ mintAddress })) || 0
        const amountBalance = Number(utilsBN.undecimalize(amount, decimals))
        const price = tokenPrices[ticket] || 0
        total += amountBalance * price
      }
      return total
    },
    [getDecimals],
  )

  return { getTotalBalance }
}
