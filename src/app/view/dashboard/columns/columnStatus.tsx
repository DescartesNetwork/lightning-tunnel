import StatusTag from 'app/components/statusTag'
import useStatus from 'app/hooks/useStatus'

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
  const { status } = useStatus({
    receipt: receiptAddress,
    startedAt,
    distributor: distributorAddress,
  })

  return <StatusTag state={status} />
}

export default ColumnStatus
