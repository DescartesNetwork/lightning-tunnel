import { utils } from '@senswap/sen-js'
import { useMintDecimals, util } from '@sentre/senhub'
import { BN } from '@project-serum/anchor'

import { Typography } from 'antd'

type ColumnAmountProps = {
  amount: BN
  mintAddress: string
}

const ColumnAmount = ({ amount, mintAddress }: ColumnAmountProps) => {
  const decimal = useMintDecimals({ mintAddress }) || 0
  return (
    <Typography.Text>
      {util
        .numeric(utils.undecimalize(BigInt(amount.toString()), decimal))
        .format('0,0.[0000]')}
    </Typography.Text>
  )
}

export default ColumnAmount
