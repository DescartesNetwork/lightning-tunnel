import configs from 'app/configs'
import { State } from 'app/constants'
import { AppState } from 'app/model'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const {
  sol: { utility },
} = configs

const CURRENT_TIME = new Date().getTime()

const useStatusAirdrop = ({
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
    if (endedAt.toNumber() * 1000 < CURRENT_TIME && endedAt.toNumber())
      return setStatus(State.expired)

    try {
      const receiptData = await utility.getReceiptData(receiptAddress)
      if (receiptData) return setStatus(State.claimed)
    } catch (error) {}
    if (startedAt * 1000 > CURRENT_TIME && startedAt)
      return setStatus(State.waiting)

    return setStatus(State.ready)
  }, [endedAt, receiptAddress, startedAt])

  useEffect(() => {
    fetchAirdropStatus()
  }, [fetchAirdropStatus])

  return { status }
}

export default useStatusAirdrop
