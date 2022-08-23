import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { web3 } from '@project-serum/anchor'
import { Connection } from '@solana/web3.js'
import { getMultipleAccounts } from '@sen-use/web3'
import { rpc } from '@sentre/senhub'

import configs from 'configs'
import { AppState } from 'model'

const {
  sol: { utility },
} = configs

const connection = new Connection(rpc)

export const useGetAllRemaining = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const getAllTokenAccounts = useCallback(
    async (distributorsAddress: string[]) => {
      const { splt } = window.sentre
      return Promise.all(
        distributorsAddress.map(async (address) => {
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
    [distributors],
  )

  const getAllRemaining = useCallback(
    async (distributorsAddress: string[]) => {
      const allTokenAccounts = await getAllTokenAccounts(distributorsAddress)
      if (!Object.values(allTokenAccounts).length) return []
      // Fetch account data
      const { splt } = window.sentre
      const listRemaining: Record<string, number> = {}
      const accountInfos = await getMultipleAccounts(
        connection,
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
