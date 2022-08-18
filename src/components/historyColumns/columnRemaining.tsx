import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { utilsBN } from '@sen-use/web3'
import { BN } from '@project-serum/anchor'
import { useMintDecimals, util } from '@sentre/senhub'

import { Typography } from 'antd'

import { AppState } from 'model'
import { useUnclaimedList } from 'hooks/useUnclaimedList'

type ColumnRemainingProps = {
  distributorAddress: string
}

const ColumnRemaining = ({ distributorAddress }: ColumnRemainingProps) => {
  const { mint } = useSelector(
    (state: AppState) => state.distributors[distributorAddress],
  )
  const decimal = useMintDecimals({ mintAddress: mint.toBase58() }) || 0
  const { unclaimed } = useUnclaimedList(distributorAddress)

  const remaining = useMemo(() => {
    let total = new BN(0)
    for (const { amount } of unclaimed) {
      total = total.add(amount)
    }
    return total
  }, [unclaimed])

  return (
    <Typography.Text>
      {util
        .numeric(utilsBN.undecimalize(remaining, decimal))
        .format('0,0.[0000]')}
    </Typography.Text>
  )
}

export default ColumnRemaining
