import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'
import { account } from '@senswap/sen-js'

import { AppDispatch } from 'model'
import { getReceipts, upsetReceipt } from 'model/receipts.controller'
import configs from 'configs'

const {
  sol: { utility },
} = configs

let watcherId = 0

const ReceiptWatcher = ({
  updateStatus,
}: {
  updateStatus: (status: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const walletAddress = useWalletAddress()

  const fetchData = useCallback(async () => {
    try {
      if (!account.isAddress(walletAddress)) return
      await dispatch(getReceipts({ authorityAddress: walletAddress })).unwrap()
    } catch (er) {
      return window.notify({
        type: 'error',
        description: 'Cannot fetch data of receipts',
      })
    } finally {
      updateStatus(false)
    }
  }, [dispatch, updateStatus, walletAddress])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const watchData = useCallback(async () => {
    watcherId = utility.program.provider.connection.onProgramAccountChange(
      utility.program.programId,
      (data) => {
        const receiptData = utility.parseReceiptData(data.accountInfo.data)
        dispatch(
          upsetReceipt({
            address: data.accountId.toBase58(),
            receipt: receiptData,
          }),
        )
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
  }, [dispatch, walletAddress])

  useEffect(() => {
    watchData()
    return () => {
      ;(async () => {
        if (!!watcherId) {
          await utility.program.provider.connection.removeProgramAccountChangeListener(
            watcherId,
          )
          watcherId = 0
        }
      })()
    }
  }, [watchData])

  return <Fragment />
}

export default ReceiptWatcher
