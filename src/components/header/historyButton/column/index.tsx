import moment from 'moment'

import { Space, Typography } from 'antd'
import ShareButton from './shareButton'
import ColumnTotal from './columnTotal'

import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import { HistoryRecord } from 'helper/history'

export const HISTORY_COLUMN = [
  {
    title: 'TIME',
    dataIndex: 'time',
    render: (time: string) => (
      <Typography.Text>
        {moment(time).format('MMM DD, YYYY HH:mm')}
      </Typography.Text>
    ),
  },
  {
    title: 'TOKEN',
    dataIndex: 'mint',
    render: (mint: string) => (
      <Space>
        <MintAvatar mintAddress={mint} />
        <MintSymbol mintAddress={mint} />
      </Space>
    ),
  },

  {
    title: 'AMOUNT',
    dataIndex: 'total',
    render: (total: string, { mint }: HistoryRecord) => (
      <ColumnTotal total={total} mint={mint} />
    ),
  },
  {
    title: 'ACTION',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <ShareButton distributorAddress={distributorAddress} />
    ),
  },
]
