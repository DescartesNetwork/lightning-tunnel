import { Fragment } from 'react'
import moment from 'moment'
import { useUI, util } from '@sentre/senhub'

import { Col, Empty, Row, Space, Table, Typography } from 'antd'
import ExpandCard from 'components/listHistory/expandCard'
import RowSpaceBetween from 'components/rowSpaceBetween'
import ColumAction from 'view/dashboard/columns/columAction'
import ColumnExpiration from 'view/dashboard/columns/columnExpiration'
import ColumnAmount from 'view/dashboard/columns/columnTotal'
import ColumnStatus from 'view/dashboard/columns/columnStatus'
import { MintAvatar, MintSymbol } from '@sen-use/app'

import { ReceiveItem } from 'hooks/useReceivedList'
import { COLUMNS_RECEIVE } from 'view/dashboard/columns'

type ReceivedHistoriesMobileProps = { receivedList: ReceiveItem[] }
const ReceivedHistoriesMobile = ({
  receivedList,
}: ReceivedHistoriesMobileProps) => {
  if (!receivedList.length) return <Empty />

  return (
    <Fragment>
      {receivedList.map((receiveItem, idx) => {
        const {
          mintAddress,
          receiptAddress,
          recipientData,
          distributorAddress,
          sender,
        } = receiveItem

        return (
          <ExpandCard
            style={{
              border: '1px solid transparent',
              borderImageSlice: '0 0 1 0',
              borderImageWidth: 1,
              borderImageSource:
                'linear-gradient(90deg,transparent, #4F5B5C, transparent)',
            }}
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
              </Row>
            }
            key={idx}
          >
            <Row gutter={[4, 4]}>
              <Col flex="auto">Unlock time:</Col>
              <Col>
                <Typography.Text>
                  {recipientData.startedAt.toNumber()
                    ? moment(recipientData.startedAt.toNumber() * 1000).format(
                        'MMM DD, YYYY HH:mm',
                      )
                    : 'Immediately'}
                </Typography.Text>
              </Col>
              <Col span={24} />
              <Col flex="auto">Expiration time:</Col>
              <Col>
                <ColumnExpiration distributorAddress={distributorAddress} />
              </Col>
            </Row>
          </ExpandCard>
        )
      })}
    </Fragment>
  )
}

type ReceivedHistoriesProps = { receivedList: ReceiveItem[] }
const ReceivedHistories = ({ receivedList }: ReceivedHistoriesProps) => {
  const width = useUI().ui.width

  if (width < 768)
    return <ReceivedHistoriesMobile receivedList={receivedList} />

  return (
    <Table
      dataSource={receivedList}
      pagination={false}
      columns={COLUMNS_RECEIVE}
      rowKey={(record) => record.distributorAddress + record.index}
    />
  )
}

export default ReceivedHistories
