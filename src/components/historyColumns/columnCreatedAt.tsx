import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { utils, web3 } from '@project-serum/anchor'
import { net } from '@sentre/senhub'

import moment from 'moment'

import { Typography } from 'antd'
import configs from 'configs'
import { AppState } from 'model'

const ColumnCreatedAt = ({
  distributorAddress,
}: {
  distributorAddress: string
}) => {
  const [createdAt, setCreatedAt] = useState(0)
  const mint = useSelector(
    (state: AppState) => state.distributors[distributorAddress].mint,
  )

  const fetchFromSolscan = useCallback(async () => {
    if (net !== 'mainnet') return []
    const treasurerAddress = await configs.sol.utility.deriveTreasurerAddress(
      distributorAddress,
    )
    const treasury = await utils.token.associatedAddress({
      owner: new web3.PublicKey(treasurerAddress),
      mint,
    })
    const api_transaction = `https://public-api.solscan.io/account/transactions?account=${treasury.toBase58()}&limit=100`

    const response = (await fetch(api_transaction)).json()
    return await response
  }, [distributorAddress, mint])

  const fetchCreatedAt = useCallback(async () => {
    const transactions =
      await window.sentre.lamports.connection.getSignaturesForAddress(
        new web3.PublicKey(distributorAddress),
        { limit: 1000 },
      )

    if (transactions.length)
      return setCreatedAt(transactions[transactions.length - 1].blockTime || 0)

    const backupTrans = await fetchFromSolscan()
    if (!backupTrans.length) return setCreatedAt(0)

    return setCreatedAt(backupTrans[backupTrans.length - 1].blockTime || 0)
  }, [distributorAddress, fetchFromSolscan])

  useEffect(() => {
    fetchCreatedAt()
  }, [fetchCreatedAt])

  return (
    <Typography.Text>
      {createdAt ? moment(createdAt * 1000).format('MMM DD, YYYY HH:mm') : '--'}
    </Typography.Text>
  )
}

export default ColumnCreatedAt
