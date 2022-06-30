import { useSelector } from 'react-redux'
import moment from 'moment'

import { AppState } from 'model'
import { Typography } from 'antd'

const ColumnExpiration = ({
  distributorAddress,
}: {
  distributorAddress: string
}) => {
  const endedAt = useSelector(
    (state: AppState) => state.distributors[distributorAddress].endedAt,
  )
  return (
    <Typography.Text>
      {endedAt.toNumber()
        ? moment(endedAt.toNumber() * 1000).format('MMM DD, YYYY HH:mm')
        : 'Unlimited'}
    </Typography.Text>
  )
}

export default ColumnExpiration
