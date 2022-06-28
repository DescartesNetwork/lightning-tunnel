import { useMint } from '@senhub/providers'
import BN from 'bn.js'
import { useCallback } from 'react'
import { fetchMulCGK } from 'shared/util'
import { utilsBN } from 'app/helper/utilsBN'

export const useCgk = () => {
  const { tokenProvider, getDecimals } = useMint()

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
      for (const { mint, amount, ticket } of filteredMintBalances) {
        const decimals = await getDecimals(mint)
        const amountBalance = Number(utilsBN.undecimalize(amount, decimals))
        const price = tokenPrices[ticket] || 0
        total += amountBalance * price
      }
      return total
    },
    [getDecimals, tokenProvider],
  )

  return { getTotalBalance }
}
