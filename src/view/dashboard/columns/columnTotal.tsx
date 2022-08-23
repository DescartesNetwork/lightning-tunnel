import { BN } from '@project-serum/anchor'

import { MintAmount } from '@sen-use/app'

type ColumnAmountProps = {
  amount: BN
  mintAddress: string
}

const ColumnAmount = ({ amount, mintAddress }: ColumnAmountProps) => {
  return <MintAmount mintAddress={mintAddress} amount={amount} />
}

export default ColumnAmount
