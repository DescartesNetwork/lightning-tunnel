import { utils } from '@senswap/sen-js'

import { Typography } from 'antd'
import BN from 'bn.js'

import useMintDecimals from 'shared/hooks/useMintDecimals'
import { numeric } from 'shared/util'

type ColumnAmountProps = {
  amount: BN
  mintAddress: string
}

const ColumnAmount = ({ amount, mintAddress }: ColumnAmountProps) => {
  const decimal = useMintDecimals(mintAddress) || 0
  return (
    <Typography.Text>
      {numeric(utils.undecimalize(BigInt(amount.toString()), decimal)).format(
        '0,0.[0000]',
      )}
    </Typography.Text>
  )
}

export default ColumnAmount
