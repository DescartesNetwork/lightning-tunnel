import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Connection } from '@solana/web3.js'
import { rpc } from '@sentre/senhub'

import { AppDispatch } from 'model'
import { getDistributors, upsetDistributor } from 'model/distributor.controller'
import configs from 'configs'

const {
  sol: { utility },
} = configs

let watcherId = 0
const connection = new Connection(rpc, 'confirmed')

const DistributorWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()

  const watchData = useCallback(async () => {
    watcherId = connection.onProgramAccountChange(
      utility.program.programId,
      (data) => {
        try {
          const distributorData = utility.parseDistributorData(
            data.accountInfo.data,
          )
          dispatch(
            upsetDistributor({
              address: data.accountId.toBase58(),
              distributorData,
            }),
          ).unwrap()
        } catch (error) {}
      },
      'confirmed',
      [
        {
          dataSize: 160,
        },
      ],
    )
    if (!watcherId) setTimeout(() => watchData(), 500)
  }, [dispatch])

  useEffect(() => {
    watchData()
    dispatch(getDistributors())
  }, [dispatch, watchData])

  return <Fragment />
}

export default DistributorWatcher
