import { MintAmount } from '@sen-use/app'
import { BN } from '@project-serum/anchor'

type ColumnTotalProps = {
  total: string
  mintAddress: string
}

const ColumnTotal = ({ total, mintAddress }: ColumnTotalProps) => {
  return <MintAmount amount={new BN(total)} mintAddress={mintAddress} />
}

export default ColumnTotal
