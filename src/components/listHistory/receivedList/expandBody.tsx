import moment from 'moment'

import { ReceiveItem } from 'hooks/useReceivedList'
import { Col, Row, Space, Typography } from 'antd'
import ColumAction from 'view/dashboard/columns/columAction'
import ColumnStatus from 'view/dashboard/columns/columnStatus'
import { MintAmount, MintSymbol } from '@sen-use/app'

import { FORMAT_DATE } from '../../../constants'
const ExpandBody = ({ receiveItem }: { receiveItem: ReceiveItem }) => {
  const { mintAddress, receiptAddress, distributorAddress, recipientData } =
    receiveItem
  const startedAt = recipientData.startedAt.toNumber()

  return (
    <Row align="middle" justify="center">
      <Col flex="auto">
        <Space direction="vertical">
          <Space>
            <MintAmount
              mintAddress={mintAddress}
              amount={recipientData.amount}
            />
            <MintSymbol mintAddress={mintAddress} />
          </Space>
          <Typography.Text>
            {moment(startedAt * 1000).format(FORMAT_DATE)}
          </Typography.Text>
        </Space>
      </Col>
      <Col>
        <Space>
          <ColumnStatus
            startedAt={startedAt}
            receiptAddress={receiptAddress}
            distributorAddress={distributorAddress}
          />
          <ColumAction
            distributorAddress={distributorAddress}
            recipientData={recipientData}
            receiptAddress={receiptAddress}
          />
        </Space>
      </Col>
    </Row>
  )
}

export default ExpandBody
