import moment from 'moment'

import { Button, Space, Typography } from 'antd'
import { numeric } from 'shared/util'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

export const COLUMNS_AIRDROP = [
  {
    title: 'CREATED DATE',
    dataIndex: 'date',
    render: (startedAt: string) => (
      <Typography.Text>
        {moment(startedAt).format('MMM DD, YYYY HH:mm')}
      </Typography.Text>
    ),
  },
  {
    title: 'UNLOCK DATE',
    dataIndex: 'distributorATA',
    render: (endAt: string) => (
      <Typography.Text>
        {moment(endAt).format('MMM DD, YYYY HH:mm')}
      </Typography.Text>
    ),
  },
  {
    title: 'TOKEN',
    dataIndex: 'mintAddress',
    render: (mintAddress: string) => (
      <Space>
        <MintAvatar mintAddress={mintAddress} />
        <MintSymbol mintAddress={mintAddress} />
      </Space>
    ),
  },

  {
    title: 'AMOUNT',
    dataIndex: 'amount',
    render: (amount: string) => (
      <Typography.Text>{numeric(amount).format('0,0.[000]')}</Typography.Text>
    ),
  },

  {
    title: 'ACTION',
    dataIndex: 'status',
    render: (time: string) => <Button type="text">SHARE</Button>,
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
