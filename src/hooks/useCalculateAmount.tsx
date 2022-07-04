import { useCallback } from 'react'
import BN from 'bn.js'

const useCalculateAmount = () => {
  const calcListAmount = useCallback(
    (amount: BN, distributionAmount: number) => {
      const listAmount = []
      const lastNumber = distributionAmount - 1
      const singleAmount = amount.div(new BN(distributionAmount))
      let currentTotal = new BN(0)
      for (let i = 0; i < distributionAmount; i++) {
        if (i === lastNumber) {
          const nextAmount = amount.sub(currentTotal)
          listAmount.push(BigInt(nextAmount.toString()))
          continue
        }
        currentTotal = currentTotal.add(singleAmount)
        listAmount.push(BigInt(singleAmount.toString()))
      }
      return listAmount
    },
    [],
  )

  return { calcListAmount }
}

export default useCalculateAmount
