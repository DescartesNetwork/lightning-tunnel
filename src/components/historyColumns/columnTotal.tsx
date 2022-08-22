import { utils } from '@senswap/sen-js'
import { util, useMintDecimals } from '@sentre/senhub'

import { Typography } from 'antd'

type ColumnTotalProps = {
  total: string
  mintAddress: string
}

const ColumnTotal = ({ total, mintAddress }: ColumnTotalProps) => {
  const decimal = useMintDecimals({ mintAddress }) || 0
  return (
    <Typography.Text>
      {util
        .numeric(utils.undecimalize(BigInt(total), decimal))
        .format('0,0.[0000]')}
    </Typography.Text>
  )
}

export default ColumnTotal
