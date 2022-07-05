import { Fragment } from 'react'
import { util } from '@sentre/senhub'
import moment from 'moment'

import { Col, Row, Space, Typography } from 'antd'
import ColumAction from '../columns/columAction'
import ColumnExpiration from '../columns/columnExpiration'
import ColumnTotal from 'view/vesting/history/columns/columnTotal'
import ColumnStatus from '../columns/columnStatus'
import RowBetweenNodeTitle from 'components/rowBetweenNodeTitle'
import RowSpaceBetween from 'components/rowSpaceBetween'
import ExpandCard from 'components/expandCard'
import ColumnAmount from '../columns/columnTotal'

import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import { ReceiveItem } from 'model/listReceived.controller'

type ListVestingMobileProps = {
  listVesting: ReceiveItem[]
  amountVesting: number
}

const ListVestingMobile = ({
  listVesting,
  amountVesting,
}: ListVestingMobileProps) => {
  return (
    <Fragment>
      {listVesting.slice(0, amountVesting).map((vesting, idx) => {
        const {
          mintAddress,
          receiptAddress,
          recipientData,
          distributorAddress,
          sender,
          children,
        } = vesting

        return (
          <ExpandCard
            style={{
              border: '1px solid transparent',
              borderImageSlice: '0 0 1 0',
              borderImageWidth: 1,
              borderImageSource:
                'linear-gradient(90deg,transparent, #4F5B5C, transparent)',
            }}
            cardId={vesting.receiptAddress}
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
                <Col span={24}>
                  <Space size={6}>
                    <Typography.Text type="secondary">
                      Expiration time:
                    </Typography.Text>
                    <ColumnExpiration distributorAddress={distributorAddress} />
                  </Space>
                </Col>
              </Row>
            }
            key={idx}
          >
            <Row gutter={[4, 4]}>
              {children?.map((childrenVesting, idx) => {
                const {
                  mintAddress: childMintAddress,
                  recipientData: childReciptData,
                  receiptAddress: childReciptAddr,
                  distributorAddress: childDistributorAddr,
                } = childrenVesting

                return (
                  <Col span={24} key={idx}>
                    <RowBetweenNodeTitle
                      title={
                        <Space direction="vertical" size={0}>
                          <Space>
                            <ColumnTotal
                              total={childReciptData.amount.toString()}
                              mint={childMintAddress}
                            />
                            <MintSymbol mintAddress={mintAddress} />
                          </Space>
                          <Typography.Text type="secondary">
                            {childReciptData.startedAt.toNumber()
                              ? moment(
                                  childReciptData.startedAt.toNumber() * 1000,
                                ).format('MMM DD, YYYY HH:mm')
                              : 'Immediately'}
                          </Typography.Text>
                        </Space>
                      }
                    >
                      <Space>
                        <ColumnStatus
                          receiptAddress={childReciptAddr}
                          startedAt={childReciptData.startedAt.toNumber()}
                          distributorAddress={childDistributorAddr}
                        />
                        <ColumAction
                          distributorAddress={childDistributorAddr}
                          receiptAddress={childReciptAddr}
                          recipientData={childReciptData}
                        />
                      </Space>
                    </RowBetweenNodeTitle>
                  </Col>
                )
              })}
            </Row>
          </ExpandCard>
        )
      })}
    </Fragment>
  )
}

export default ListVestingMobile
