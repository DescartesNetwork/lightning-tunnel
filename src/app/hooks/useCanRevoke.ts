import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import configs from 'app/configs'
import { AppState } from 'app/model'

const {
  sol: { utility },
} = configs

const CURRENT_TIME = Date.now()

export const getBalanceTreasury = async (distributorAddress: string) => {
  const { splt } = window.sentre
  const distributor = await utility.getDistributorData(distributorAddress)
  const { mint } = distributor

  const treasurerAddress = await utility.deriveTreasurerAddress(
    distributorAddress,
  )
  const associatedAddress = await splt.deriveAssociatedAddress(
    treasurerAddress,
    mint.toBase58(),
  )
  const { amount } = await splt.getAccountData(associatedAddress)

  return Number(amount)
}

const useCanRevoke = ({
  distributorAddress,
}: {
  distributorAddress: string
}) => {
  const [isRevoke, setIsRevoke] = useState(false)
  const [disabled, setSetDisabled] = useState(false)
  const endedAt = useSelector(
    (state: AppState) => state.distributors[distributorAddress].endedAt,
  )

  const checkCanRevoke = useCallback(async () => {
    const endTime = endedAt.toNumber() * 1000
    if (!endTime) return setIsRevoke(false)

    const balance = await getBalanceTreasury(distributorAddress)
    if (balance === 0) setSetDisabled(true)

    if (endTime < CURRENT_TIME) return setIsRevoke(true)
    return setIsRevoke(false)
  }, [distributorAddress, endedAt])

  useEffect(() => {
    checkCanRevoke()
  }, [checkCanRevoke])

  return { isRevoke, disabled }
}

export default useCanRevoke
