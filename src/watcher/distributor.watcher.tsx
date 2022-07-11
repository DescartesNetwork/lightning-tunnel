import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'model'
import { getDistributors, upsetDistributor } from 'model/distributor.controller'
import configs from 'configs'

const {
  sol: { utility },
} = configs

let watcherId = 0

const DistributorWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()

  const watchData = useCallback(async () => {
    watcherId = utility.program.provider.connection.onProgramAccountChange(
      utility.program.programId,
      (data) => {
        const distributorData = utility.parseDistributorData(
          data.accountInfo.data,
        )
        dispatch(
          upsetDistributor({
            address: data.accountId.toBase58(),
            distributorData,
          }),
        )
      },
      'confirmed',
      [
        {
          dataSize: 160,
        },
      ],
    )
  }, [dispatch])

  useEffect(() => {
    dispatch(getDistributors())
    watchData()
    return () => {
      ;(async () => {
        await utility.removeListener(watcherId)
        watcherId = 0
      })()
    }
  }, [dispatch, watchData])

  return <Fragment />
}

export default DistributorWatcher
