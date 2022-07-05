import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'

const useCanRevoke = (distributorAddress: string, remaining: number) => {
  const [isRevoke, setIsRevoke] = useState(false)
  const [disabled, setSetDisabled] = useState(false)

  const endedAt = useSelector(
    (state: AppState) => state.distributors[distributorAddress].endedAt,
  )

  const checkCanRevoke = useCallback(async () => {
    const CURRENT_TIME = Date.now()
    const endTime = endedAt.toNumber() * 1000
    if (!endTime) return setIsRevoke(false)

    if (remaining === 0) setSetDisabled(true)

    if (endTime < CURRENT_TIME) return setIsRevoke(true)

    return setIsRevoke(false)
  }, [endedAt, remaining])

  useEffect(() => {
    checkCanRevoke()
  }, [checkCanRevoke])

  return { isRevoke, disabled }
}

export default useCanRevoke
