import moment from 'moment'
import { util } from '@sentre/senhub'

import { ReceiveItem } from 'hooks/useReceivedList'
import { Col, Row, Space, Typography } from 'antd'
import ExpandCard from '../expandCard'
import RowSpaceBetween from 'components/rowSpaceBetween'
import ColumAction from 'view/dashboard/columns/columAction'
import ColumnExpiration from 'view/dashboard/columns/columnExpiration'
import ColumnAmount from 'view/dashboard/columns/columnTotal'
import ColumnStatus from 'view/dashboard/columns/columnStatus'
import { MintAvatar, MintSymbol } from '@sen-use/app'

import { FORMAT_DATE } from '../../../constants'

type AirdropMobileCardProps = { receiveItem: ReceiveItem }
const AirdropMobileCard = ({ receiveItem }: AirdropMobileCardProps) => {
  const {
    mintAddress,
    receiptAddress,
    distributorAddress,
    recipientData,
    sender,
  } = receiveItem
  const startedAt = recipientData.startedAt.toNumber() * 10000

  return (
    <ExpandCard
      cardId={receiptAddress}
      cardHeader={
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Row align="middle" gutter={[24, 24]}>
              <Col flex="auto">
                <Space>
                  <MintAvatar mintAddress={mintAddress} />
                  <Space size={6}>
                    <ColumnAmount
                      amount={recipientData.amount}
                      mintAddress={mintAddress}
                    />
                    <MintSymbol mintAddress={mintAddress} />
                  </Space>
                </Space>
              </Col>
              <Col>
                <ColumnStatus
                  receiptAddress={receiptAddress}
                  startedAt={recipientData.startedAt.toNumber()}
                  distributorAddress={distributorAddress}
                />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <RowSpaceBetween
              label={`Sender: ${util.shortenAddress(sender, 4)}`}
              value={
                <ColumAction
                  distributorAddress={distributorAddress}
                  receiptAddress={receiptAddress}
                  recipientData={recipientData}
                />
              }
            />
          </Col>
          <Col span={24}>
            <RowSpaceBetween
              label={`Expiration time`}
              value={
                <ColumnExpiration distributorAddress={distributorAddress} />
              }
            />
          </Col>
          <Col span={24}>
            <RowSpaceBetween
              label={`Unlock time`}
              value={
                <Typography.Text>
                  {startedAt
                    ? moment(startedAt).format(FORMAT_DATE)
                    : 'Immediately'}
                </Typography.Text>
              }
            />
          </Col>
        </Row>
      }
      key={receiptAddress}
    />
  )
}

export default AirdropMobileCard
