import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import BN from 'bn.js'

import configs from 'app/configs'
import { CURRENT_TIME, State } from 'app/constants'
import { AppState } from 'app/model'

const {
  sol: { utility },
} = configs

export const getStatus = async (
  receiptAddress: string,
  startedAt: number,
  endedAt: BN,
) => {
  if (endedAt.toNumber() * 1000 < CURRENT_TIME && endedAt.toNumber())
    return State.expired

  try {
    const receiptData = await utility.getReceiptData(receiptAddress)
    if (receiptData) return State.claimed
  } catch (error) {}
  if (startedAt * 1000 > CURRENT_TIME && startedAt) return State.waiting

  return State.ready
}

const useStatus = ({
  receiptAddress,
  startedAt,
  distributorAddress,
}: {
  receiptAddress: string
  startedAt: number
  distributorAddress: string
}) => {
  const [status, setStatus] = useState<State>()
  const endedAt = useSelector(
    (state: AppState) => state.distributors[distributorAddress].endedAt,
  )

  const fetchAirdropStatus = useCallback(async () => {
    const status = await getStatus(receiptAddress, startedAt, endedAt)
    return setStatus(status)
  }, [endedAt, receiptAddress, startedAt])

  useEffect(() => {
    fetchAirdropStatus()
  }, [fetchAirdropStatus])

  return { status }
}

export default useStatus
