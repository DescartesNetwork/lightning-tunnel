import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { State } from 'app/constants'
import { AppState } from 'app/model'

const CURRENT_TIME = Date.now()

type PropsUseStatus = {
  receipt: string
  startedAt: number
  distributor: string
}

const useStatus = (props?: PropsUseStatus) => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const [status, setStatus] = useState<State>()
  const receipts = useSelector((state: AppState) => state.receipts)

  const fetchAirdropStatus = useCallback(
    async (props: PropsUseStatus) => {
      const { receipt, startedAt, distributor } = props
      const receiptData = receipts[receipt]
      const endedAt = distributors[distributor].endedAt
      if (receiptData) return State.claimed
      if (endedAt.toNumber() * 1000 < CURRENT_TIME && endedAt.toNumber())
        return State.expired

      if (startedAt * 1000 > CURRENT_TIME && startedAt) return State.waiting
      return State.ready
    },
    [distributors, receipts],
  )

  const updateStatus = useCallback(
    async (props: PropsUseStatus) => {
      const state = await fetchAirdropStatus(props)
      return setStatus(state)
    },
    [fetchAirdropStatus],
  )

  useEffect(() => {
    if (props) updateStatus(props)
  }, [updateStatus, props])

  return { status, fetchAirdropStatus }
}

export default useStatus
