import { utils } from '@senswap/sen-js'
import { util } from '@sentre/senhub'

import { Typography } from 'antd'

import useMintDecimals from 'shared/hooks/useMintDecimals'

type ColumnTotalProps = {
  total: string
  mint: string
}

const ColumnTotal = ({ total, mint }: ColumnTotalProps) => {
  const decimal = useMintDecimals(mint) || 0
  return (
    <Typography.Text>
      {util
        .numeric(utils.undecimalize(BigInt(total), decimal))
        .format('0,0.[0000]')}
    </Typography.Text>
  )
}

export default ColumnTotal
