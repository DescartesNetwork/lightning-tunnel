import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWallet } from '@senhub/providers'
import { account } from '@senswap/sen-js'

import { AppDispatch } from 'app/model'
import { getReceipts, upsetReceipt } from 'app/model/receipts.controller'
import configs from 'app/configs'
import { Connection } from '@solana/web3.js'
import { rpc } from 'shared/runtime'

const {
  sol: { utility },
} = configs

let watcherId = 0
const connection = new Connection(rpc, 'confirmed')

const ReceiptWatcher = () => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const dispatch = useDispatch<AppDispatch>()

  const fetchData = useCallback(async () => {
    try {
      if (!account.isAddress(walletAddress)) return
      await dispatch(getReceipts({ authorityAddress: walletAddress })).unwrap()
    } catch (er) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch data of receipts',
      })
    }
  }, [dispatch, walletAddress])

  const watchData = useCallback(async () => {
    watcherId = connection.onProgramAccountChange(
      utility.program.programId,
      (data) => {
        try {
          const receiptData = utility.parseReceiptData(data.accountInfo.data)
          dispatch(
            upsetReceipt({
              address: data.accountId.toBase58(),
              receipt: receiptData,
            }),
          ).unwrap()
        } catch (error) {}
      },
      'confirmed',
      [
        {
          dataSize: 128,
        },
        {
          memcmp: {
            offset: 8,
            bytes: walletAddress,
          },
        },
      ],
    )
    if (!watcherId) setTimeout(() => watchData(), 500)
  }, [dispatch, walletAddress])

  useEffect(() => {
    watchData()
    fetchData()
    return () => {
      ;(async () => {
        await utility.removeListener(watcherId)
      })()
    }
  }, [fetchData, watchData])

  return <Fragment />
}

export default ReceiptWatcher
