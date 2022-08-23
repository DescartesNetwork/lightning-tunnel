import { useCallback } from 'react'
import { web3 } from '@project-serum/anchor'
import { getMultipleAccounts } from '@sen-use/web3'

import configs from 'configs'
import { DistributorState } from 'model/distributor.controller'

const {
  sol: { utility },
} = configs

export const useGetAllRemaining = () => {
  const getAllTokenAccounts = useCallback(
    async (distributors: DistributorState) => {
      const { splt } = window.sentre
      return Promise.all(
        Object.keys(distributors).map(async (address) => {
          const { mint } = distributors[address]
          const treasurerAddress = await utility.deriveTreasurerAddress(address)
          const associatedAddress = await splt.deriveAssociatedAddress(
            treasurerAddress,
            mint.toBase58(),
          )
          return new web3.PublicKey(associatedAddress)
        }),
      )
    },
    [],
  )

  const getAllRemaining = useCallback(
    async (distributors: DistributorState) => {
      const allTokenAccounts = await getAllTokenAccounts(distributors)
      if (!Object.values(allTokenAccounts).length) return []
      // Fetch account data
      const { splt } = window.sentre
      const listRemaining: Record<string, number> = {}
      const accountInfos = await getMultipleAccounts(
        splt.connection,
        allTokenAccounts,
      )
      // Parser account data
      for (const accountInfo of accountInfos) {
        if (!accountInfo) continue
        const { amount, owner } = await splt.parseAccountData(
          accountInfo.account.data,
        )
        listRemaining[owner] = Number(amount)
      }
      // Build result
      return Promise.all(
        accountInfos.map(async (accountInfo) => {
          if (!accountInfo) return { amount: 0 }
          const { amount } = await splt.parseAccountData(
            accountInfo.account.data,
          )
          return { amount: Number(amount.toString()) }
        }),
      )
    },
    [getAllTokenAccounts],
  )

  return getAllRemaining
}
