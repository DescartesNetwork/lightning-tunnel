import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'model'
import { getDistributors, upsetDistributor } from 'model/distributor.controller'
import configs from 'configs'

const {
  sol: { utility },
} = configs

let watcherId = 0

const DistributorWatcher = ({
  updateStatus,
}: {
  updateStatus: (status: boolean) => void
}) => {
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

  const initDistributors = useCallback(async () => {
    await dispatch(getDistributors())
    updateStatus(false)
  }, [dispatch, updateStatus])
  useEffect(() => {
    initDistributors()
  }, [initDistributors])

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
  }, [dispatch, watchData])

  return <Fragment />
}

export default DistributorWatcher
