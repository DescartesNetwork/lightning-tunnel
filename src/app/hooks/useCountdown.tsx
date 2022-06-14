import { useEffect, useState } from 'react'

export const DEFAULT_TEN_MINUTE = 10 * 60

const useCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_TEN_MINUTE)

  useEffect(() => {
    if (timeRemaining === 0) return setTimeRemaining(DEFAULT_TEN_MINUTE)
    setTimeout(() => {
      setTimeRemaining(timeRemaining - 1)
    }, 1000)
  }, [timeRemaining])

  return { timeRemaining }
}

export default useCountdown
