import { useMemo } from 'react'
import moment from 'moment'
import { MerkleDistributor } from '@sentre/utility'

import { Typography } from 'antd'

const UnlockDateColumn = ({ treeData }: { treeData?: Buffer }) => {
  const startedAt = useMemo(() => {
    if (!treeData) return 0
    const parseData = JSON.parse(JSON.stringify(treeData)).data
    const merkleDistributor = MerkleDistributor.fromBuffer(
      Buffer.from(parseData),
    )
    return merkleDistributor.recipients[0].startedAt.toNumber()
  }, [treeData])
  return (
    <Typography.Text>
      {startedAt
        ? moment(startedAt * 1000).format('MMM DD, YYYY HH:mm')
        : 'Immediately'}
    </Typography.Text>
  )
}
export default UnlockDateColumn
