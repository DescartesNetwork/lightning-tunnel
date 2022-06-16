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

  const fetchReceiptStatus = useCallback(async () => {
    try {
      const receiptData = await utility.getReceiptData(receiptAddress)
      if (receiptData) return setStatus(State.claimed)
    } catch (error) {}
    if (endedAt.toNumber() * 1000 < new Date().getTime())
      return setStatus(State.expired)
    if (!startedAt) return setStatus(State.ready)
    if (startedAt * 1000 < CURRENT_TIME) return setStatus(State.waiting)
  }, [endedAt, receiptAddress, startedAt])

  useEffect(() => {
    fetchReceiptStatus()
  }, [fetchReceiptStatus])

  return { status }
}

export default useStatusAirdrop
