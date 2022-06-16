import StatusTag from 'app/components/statusTag'
import useStatusAirdrop from 'app/hooks/airdrop/useStatusAirdrop'

type ColumnStatusProps = {
  receiptAddress: string
  startedAt: number
  distributorAddress: string
}
const ColumnStatus = ({
  receiptAddress,
  startedAt,
  distributorAddress,
}: ColumnStatusProps) => {
  const { status } = useStatusAirdrop({
    receiptAddress,
    startedAt,
    distributorAddress,
  })

  return <StatusTag state={status} />
}

export default ColumnStatus
