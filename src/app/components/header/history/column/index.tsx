import moment from 'moment'

import { Space, Typography } from 'antd'
import ShareButton from './shareButton'

import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import { numeric } from 'shared/util'

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
    render: (total: string) => (
      <Typography.Text>{numeric(total).format('0,0.[0000]')}</Typography.Text>
    ),
  },
  {
    title: 'ACTION',
    dataIndex: 'cid',
    render: (cid: string) => <ShareButton cid={cid} />,
  },
]
