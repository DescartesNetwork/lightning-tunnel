import { Leaf } from '@sentre/utility'
import moment from 'moment'
import { util } from '@sentre/senhub'

import { Space, Typography } from 'antd'
import ColumnAmount from './columnTotal'
import ColumnStatus from './columnStatus'
import ColumAction from './columAction'
import ColumnExpiration from './columnExpiration'

import { ColumnsType } from 'antd/lib/table'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import { ReceiveItem } from 'model/listReceived.controller'

import './index.less'

export const COLUMNS_AIRDROP: ColumnsType<any> = [
  {
    title: 'UNLOCK DATE',
    dataIndex: 'recipientData',
    render: ({ startedAt }: Leaf) => (
      <Typography.Text>
        {startedAt.toNumber()
          ? moment(startedAt.toNumber() * 1000).format('MMM DD, YYYY HH:mm')
          : 'Immediately'}
      </Typography.Text>
    ),
  },
  {
    title: 'EXPIRATION TIME',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <ColumnExpiration distributorAddress={distributorAddress} />
    ),
  },
  {
    title: 'SENDER',
    dataIndex: 'sender',
    render: (sender: string) => (
      <Typography.Text
        style={{ cursor: 'pointer' }}
        underline
        onClick={() => window.open(util.explorer(sender), '_blank')}
      >
        {util.shortenAddress(sender)}
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
    dataIndex: 'recipientData',
    render: ({ amount }: Leaf, { mintAddress }: ReceiveItem) => (
      <ColumnAmount amount={amount} mintAddress={mintAddress} />
    ),
  },

  {
    title: 'STATUS',
    dataIndex: 'recipientData',
    render: (
      { startedAt }: Leaf,
      { receiptAddress, distributorAddress }: ReceiveItem,
    ) => (
      <ColumnStatus
        startedAt={startedAt.toNumber()}
        receiptAddress={receiptAddress}
        distributorAddress={distributorAddress}
      />
    ),
  },
  {
    title: 'ACTION',
    dataIndex: 'distributorAddress',
    render: (
      distributorAddress: string,
      { receiptAddress, recipientData }: ReceiveItem,
    ) => (
      <ColumAction
        distributorAddress={distributorAddress}
        recipientData={recipientData}
        receiptAddress={receiptAddress}
      />
    ),
  },
]
