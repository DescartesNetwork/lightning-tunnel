import moment from 'moment'

import { Space, Typography } from 'antd'
import UnlockDateColumn from './unlockDateColumn'
import ColumnTotal from './columnTotal'
import ActionButton from './actionButton'

import { HistoryRecord } from 'app/helper/history'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

export const COLUMNS_AIRDROP = [
  {
    title: 'CREATED DATE',
    dataIndex: 'time',
    render: (time: string) => (
      <Typography.Text>
        {moment(time).format('MMM DD, YYYY HH:mm')}
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
    render: (total: string, { mint }: HistoryRecord) => (
      <ColumnTotal total={total} mint={mint} />
    ),
  },

  {
    title: 'ACTION',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <ActionButton distributorAddress={distributorAddress} />
    ),
  },
]

export const DEFAULT_DATA = [
  {
    key: 1,
    endAt: new Date(),
    startedAt: new Date(),
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
  },
  {
    key: 2,
    endAt: new Date(),
    startedAt: new Date(),
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
  },
  {
    key: 3,
    endAt: new Date(),
    startedAt: new Date(),
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
  },
  {
    key: 4,
    endAt: new Date(),
    startedAt: new Date(),
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
  },
  {
    key: 5,
    endAt: new Date(),
    startedAt: new Date(),
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
  },
  {
    key: 6,
    endAt: new Date(),
    startedAt: new Date(),
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
  },
]
