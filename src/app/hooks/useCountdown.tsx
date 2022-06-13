import { useEffect, useState } from 'react'

export const DEFAULT_FIVE_MINUTE = 10 * 60

const useCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_FIVE_MINUTE)

  useEffect(() => {
    if (timeRemaining === 0) return setTimeRemaining(DEFAULT_FIVE_MINUTE)
    setTimeout(() => {
      setTimeRemaining(timeRemaining - 1)
    }, 1000)
  }, [timeRemaining])

  return { timeRemaining }
}

export default useCountdown
