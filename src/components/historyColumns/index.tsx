import moment from 'moment'

import { Space, Typography } from 'antd'
import UnlockDateColumn from './unlockDateColumn'
import ColumnTotal from './columnTotal'
import ActionButton from './actionButton'

import { MintAvatar, MintSymbol } from '@sen-use/components'
import { ItemSent } from 'hooks/useSentList'

export const HISTORY_COLUMNS = [
  {
    title: 'CREATED DATE',
    dataIndex: 'time',
    render: (time: string) => (
      <Typography.Text>
        {time ? moment(time).format('MMM DD, YYYY HH:mm') : '--'}
      </Typography.Text>
    ),
  },
  {
    title: 'UNLOCK DATE',
    dataIndex: 'treeData',
    render: (treeData: Buffer) => <UnlockDateColumn treeData={treeData} />,
  },
  {
    title: 'TOKEN',
    dataIndex: 'mint',
    render: (mintAddress: string) => (
      <Space>
        <MintAvatar mintAddress={mintAddress} />
        <MintSymbol mintAddress={mintAddress} />
      </Space>
    ),
  },

  {
    title: 'AMOUNT',
    dataIndex: 'total',
    render: (total: string, { mint }: ItemSent) => (
      <ColumnTotal total={total} mint={mint} />
    ),
  },

  {
    title: 'ACTION',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string, { remaining, treeData }: ItemSent) => (
      <ActionButton
        remaining={remaining}
        distributorAddress={distributorAddress}
        treeData={treeData}
      />
    ),
  },
]
