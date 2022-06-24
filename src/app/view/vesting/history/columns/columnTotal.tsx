import { utils } from '@senswap/sen-js'

import { Typography } from 'antd'

import useMintDecimals from 'shared/hooks/useMintDecimals'
import { numeric } from 'shared/util'

type ColumnTotalProps = {
  total: string
  mint: string
}

const ColumnTotal = ({ total, mint }: ColumnTotalProps) => {
  const decimal = useMintDecimals(mint) || 0
  return (
    <Typography.Text>
      {numeric(utils.undecimalize(BigInt(total), decimal)).format('0,0.[0000]')}
    </Typography.Text>
  )
}

export default ColumnTotal
