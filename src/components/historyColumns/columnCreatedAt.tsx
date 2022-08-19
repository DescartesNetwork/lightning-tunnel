import { useCallback, useEffect, useState } from 'react'
import { web3 } from '@project-serum/anchor'
import { Typography } from 'antd'
import moment from 'moment'

const ColumnCreatedAt = ({
  distributorAddress,
}: {
  distributorAddress: string
}) => {
  const [createdAt, setCreatedAt] = useState(0)
  const fetchCreatedAt = useCallback(async () => {
    const data =
      await window.sentre.lamports.connection.getSignaturesForAddress(
        new web3.PublicKey(distributorAddress),
        { limit: 1000 },
      )
    return setCreatedAt(data[data.length - 1].blockTime || 0)
  }, [distributorAddress])

  useEffect(() => {
    fetchCreatedAt()
  }, [fetchCreatedAt])

  return (
    <Typography.Text>
      {createdAt ? moment(createdAt * 1000).format('MMM DD, YYYY HH:mm') : '--'}
    </Typography.Text>
  )
}

export default ColumnCreatedAt
