import { useSelector } from 'react-redux'

import { AppState } from 'model'
import { MintAmount } from '@sen-use/app/dist'

type ColumnRemainingProps = {
  distributorAddress: string
}

const ColumnRemaining = ({ distributorAddress }: ColumnRemainingProps) => {
  const { mint, claimed, total } = useSelector(
    (state: AppState) => state.distributors[distributorAddress],
  )

  return (
    <MintAmount mintAddress={mint.toBase58()} amount={total.sub(claimed)} />
  )
}

export default ColumnRemaining
