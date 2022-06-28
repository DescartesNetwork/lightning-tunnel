import { Fragment, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useUI } from '@senhub/providers'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Space, Spin, Table, Typography } from 'antd'
import ExpandCard from 'app/components/expandCard'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import RowSpaceBetween from 'app/components/rowSpaceBetween'
import ColumnExpiration from '../columns/columnExpiration'
import ColumnStatus from '../columns/columnStatus'

import useReceiveList, { ReceiveItem } from 'app/hooks/useReceiveList'
import { AppState } from 'app/model'
import { getStatus } from 'app/hooks/useStatus'
import { State } from 'app/constants'
import { TypeDistribute } from 'app/model/main.controller'
import { shortenAddress } from 'shared/util'
import { COLUMNS_AIRDROP } from '../columns'
import ColumAction from '../columns/columAction'
import RowBetweenNodeTitle from 'app/components/rowBetweenNodeTitle'
import ColumnAmount from '../columns/columnTotal'

const DEFAULT_AMOUNT = 4

const AirdropReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const { receiveList, loading } = useReceiveList({
    type: TypeDistribute.Airdrop,
  })
  const [listAirdrop, setListAirdrop] = useState<ReceiveItem[]>([])
  const distributors = useSelector((state: AppState) => state.distributors)
  const {
    ui: { width },
  } = useUI()

  const isMobile = width < 768

  const filterAirdrops = useCallback(async () => {
    if (!receiveList.length) return
    const nextAirdrops: ReceiveItem[] = []
    for (const airdrop of receiveList) {
      const { receiptAddress, distributorAddress, recipientData } = airdrop
      const { startedAt } = recipientData
      const endedAt = distributors[distributorAddress].endedAt
      const status = await getStatus(
        receiptAddress,
        startedAt.toNumber(),
        endedAt,
      )
      if (status === State.ready) {
        nextAirdrops.unshift(airdrop)
        continue
      }
      nextAirdrops.push(airdrop)
    }
    return setListAirdrop(nextAirdrops)
  }, [receiveList, distributors])

  useEffect(() => {
    filterAirdrops()
  }, [filterAirdrops])

  return (
    <Spin spinning={loading}>
      <Card className="card-lightning">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row>
              <Col flex="auto">
                <Typography.Title level={5}>Airdrop receive</Typography.Title>
              </Col>
              <Col>Filter</Col>
            </Row>
          </Col>
          <Col span={24}>
            {isMobile ? (
              <Fragment>
                {listAirdrop.slice(0, amountAirdrop).map((airdrop, idx) => {
                  const {
                    mintAddress,
                    receiptAddress,
                    recipientData,
                    distributorAddress,
                    sender,
                  } = airdrop

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
                              label={`Sender: ${shortenAddress(sender, 4)}`}
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
                              ? moment(
                                  recipientData.startedAt.toNumber() * 1000,
                                ).format('MMM DD, YYYY HH:mm')
                              : 'Immediately'}
                          </Typography.Text>
                        </Col>
                        <Col span={24} />
                        <Col flex="auto">Expiration time:</Col>
                        <Col>
                          <ColumnExpiration
                            distributorAddress={distributorAddress}
                          />
                        </Col>
                      </Row>
                    </ExpandCard>
                  )
                })}
              </Fragment>
            ) : (
              <Table
                dataSource={listAirdrop.slice(0, amountAirdrop)}
                pagination={false}
                columns={COLUMNS_AIRDROP}
                rowKey={(record) => record.receiptAddress}
              />
            )}
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              onClick={() => setAmountAirdrop(amountAirdrop + DEFAULT_AMOUNT)}
              type="ghost"
              icon={<IonIcon name="arrow-down-outline" />}
              disabled={amountAirdrop >= listAirdrop.length}
            >
              VIEW MORE
            </Button>
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default AirdropReceive
