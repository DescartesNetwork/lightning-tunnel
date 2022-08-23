import { util } from '@sentre/senhub'

import { ReceiveItem } from 'hooks/useReceivedList'
import { Col, Row, Space } from 'antd'
import ExpandCard from '../expandCard'
import RowSpaceBetween from 'components/rowSpaceBetween'
import ColumAction from 'view/dashboard/columns/columAction'
import ColumnExpiration from 'view/dashboard/columns/columnExpiration'
import ColumnAmount from 'view/dashboard/columns/columnTotal'
import ColumnStatus from 'view/dashboard/columns/columnStatus'
import ExpandBody from './expandBody'
import { MintAvatar, MintSymbol } from '@sen-use/app'

type VestingMobileCardProps = { receiveItem: ReceiveItem }
const VestingMobileCard = ({ receiveItem }: VestingMobileCardProps) => {
  const {
    mintAddress,
    receiptAddress,
    distributorAddress,
    recipientData,
    sender,
    children,
  } = receiveItem
  const startedAt = recipientData.startedAt.toNumber()

  return (
    <ExpandCard
      cardId={receiptAddress}
      cardHeader={
        <Row gutter={[12, 12]}>
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
                  startedAt={startedAt}
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
        </Row>
      }
      key={receiptAddress}
    >
      <Row gutter={[12, 12]}>
        {children?.map((receiveItem) => (
          <Col span={24} key={receiveItem.receiptAddress}>
            <ExpandBody receiveItem={receiveItem} />
          </Col>
        ))}
      </Row>
    </ExpandCard>
  )
}

export default VestingMobileCard
