import { Fragment } from 'react'
import moment from 'moment'
import { util } from '@sentre/senhub'

import { Col, Empty, Row, Space, Typography } from 'antd'

import ExpandCard from 'components/expandCard'
import RowBetweenNodeTitle from 'components/rowBetweenNodeTitle'
import RowSpaceBetween from 'components/rowSpaceBetween'
import ColumAction from 'view/dashboard/columns/columAction'
import ColumnExpiration from 'view/dashboard/columns/columnExpiration'
import ColumnAmount from 'view/dashboard/columns/columnTotal'
import ColumnStatus from 'view/dashboard/columns/columnStatus'
import { MintAvatar, MintSymbol } from '@sen-use/components'

import { ReceiveItem } from 'model/listReceived.controller'

type ListReceiveMobileProps = { listReceive: ReceiveItem[] }
const ListReceiveMobile = ({ listReceive }: ListReceiveMobileProps) => {
  if (!listReceive.length) return <Empty />

  return (
    <Fragment>
      {listReceive.map((receiveItem, idx) => {
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
                  <RowBetweenNodeTitle
                    title={
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
                    }
                  >
                    <ColumnStatus
                      receiptAddress={receiptAddress}
                      startedAt={recipientData.startedAt.toNumber()}
                      distributorAddress={distributorAddress}
                    />
                  </RowBetweenNodeTitle>
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

export default ListReceiveMobile
