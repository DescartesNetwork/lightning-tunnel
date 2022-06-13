import moment from 'moment'

import { Button, Space, Typography } from 'antd'
import { explorer, numeric, shortenAddress } from 'shared/util'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

export const COLUMNS_AIRDROP = [
  {
    title: 'UNLOCK DATE',
    dataIndex: 'date',
    render: (time: string) => (
      <Typography.Text>
        {moment(time).format('MMM DD, YYYY HH:mm')}
      </Typography.Text>
    ),
  },
  {
    title: 'SENDER',
    dataIndex: 'distributorATA',
    render: (distributorAddress: string) => (
      <Typography.Text
        style={{ cursor: 'pointer' }}
        underline
        onClick={() => window.open(explorer(distributorAddress), '_blank')}
      >
        {shortenAddress(distributorAddress)}
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
    title: 'STATUS',
    dataIndex: 'status',
    render: (state: string) => (
      <Typography.Text style={{ cursor: 'pointer' }}>
        status {state}
      </Typography.Text>
    ),
  },
  {
    title: 'ACTION',
    dataIndex: 'status',
    render: (time: string) => <Button type="text">Claim</Button>,
  },
]

export const DEFAULT_DATA = [
  {
    key: 1,
    time: new Date(),
    distributorATA: '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn',
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
    status: 1,
  },
  {
    key: 2,
    time: new Date(),
    distributorATA: '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn',
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
    status: 1,
  },
  {
    key: 3,
    time: new Date(),
    distributorATA: '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn',
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
    status: 1,
  },
  {
    key: 4,
    time: new Date(),
    distributorATA: '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn',
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
    status: 1,
  },
  {
    key: 5,
    time: new Date(),
    distributorATA: '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn',
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
    status: 1,
  },
  {
    key: 6,
    time: new Date(),
    distributorATA: '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn',
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
    status: 1,
  },
  {
    key: 7,
    time: new Date(),
    distributorATA: '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn',
    mintAddress: '11111111111111111111111111111111',
    amount: 100.12,
    status: 1,
  },
]
