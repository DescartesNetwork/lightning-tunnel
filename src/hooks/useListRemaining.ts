import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Connection, PublicKey, AccountInfo } from '@solana/web3.js'
import { rpc } from '@sentre/senhub'

import configs from 'configs'
import { AppState } from 'model'
import { account } from '@senswap/sen-js'

const {
  sol: { utility },
} = configs

const connection = new Connection(rpc)

const useListRemaining = () => {
  const [associatedAddresses, setAssociatedAddresses] = useState<
    Record<string, PublicKey>
  >({})
  const [listRemaining, setListRemaining] = useState<Record<string, number>>({})
  const distributors = useSelector((state: AppState) => state.distributors)

  const fetchListTreasuryAssociated = useCallback(async () => {
    const { splt } = window.sentre
    const bulk: Record<string, PublicKey> = {}
    for (const address in distributors) {
      const { mint } = distributors[address]
      const treasurerAddress = await utility.deriveTreasurerAddress(address)
      const associatedAddress = await splt.deriveAssociatedAddress(
        treasurerAddress,
        mint.toBase58(),
      )
      bulk[treasurerAddress] = account.fromAddress(associatedAddress)
    }
    return setAssociatedAddresses(bulk)
  }, [distributors])

  const getAllRemaining = useCallback(async () => {
    if (!Object.values(associatedAddresses).length) return
    const { splt } = window.sentre
    const listRemaining: Record<string, number> = {}
    const accountInfos = (await connection.getMultipleAccountsInfo(
      Object.values(associatedAddresses),
    )) as AccountInfo<Buffer>[]

    for (const accountInfo of accountInfos) {
      if (!accountInfo) continue
      const { amount, owner } = await splt.parseAccountData(accountInfo.data)
      listRemaining[owner] = Number(amount)
    }

    return setListRemaining(listRemaining)
  }, [associatedAddresses])

  useEffect(() => {
    fetchListTreasuryAssociated()
  }, [fetchListTreasuryAssociated])

  useEffect(() => {
    getAllRemaining()
  }, [getAllRemaining])

  return { listRemaining }
}

export default useListRemaining
