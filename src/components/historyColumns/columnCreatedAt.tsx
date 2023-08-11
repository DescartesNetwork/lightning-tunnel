import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { utils, web3 } from '@project-serum/anchor'
import { net, splt } from '@sentre/senhub'
import { encode } from 'bs58'
import moment from 'moment'

import { Typography } from 'antd'
import configs from 'configs'
import { AppDispatch, AppState } from 'model'
import { setMetadata } from 'model/metadatas.controller'

const ColumnCreatedAt = ({
  distributorAddress,
}: {
  distributorAddress: string
}) => {
  const [createdAt, setCreatedAt] = useState(0)
  const { mint, metadata: digest } = useSelector(
    (state: AppState) => state.distributors[distributorAddress],
  )
  const dispatch = useDispatch<AppDispatch>()

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
    const transactions = await splt.connection.getSignaturesForAddress(
      new web3.PublicKey(distributorAddress),
      { limit: 1000 },
    )

    if (transactions.length)
      return setCreatedAt(transactions.pop()?.blockTime || 0)

    const backupTrans = await fetchFromSolscan()
    if (!backupTrans.length) return setCreatedAt(0)
    return setCreatedAt(backupTrans.pop().blockTime || 0)
  }, [distributorAddress, fetchFromSolscan])

  const updateMetadata = useCallback(() => {
    if (!createdAt) return
    const cid = encode(digest)
    return dispatch(setMetadata({ createAt: createdAt, cid }))
  }, [createdAt, digest, dispatch])

  useEffect(() => {
    fetchCreatedAt()
  }, [fetchCreatedAt])

  useEffect(() => {
    updateMetadata()
  }, [updateMetadata])

  return (
    <Typography.Text>
      {createdAt ? moment(createdAt * 1000).format('MMM DD, YYYY HH:mm') : '--'}
    </Typography.Text>
  )
}

export default ColumnCreatedAt
