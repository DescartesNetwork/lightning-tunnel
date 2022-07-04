import { Fragment, useCallback, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useUI, util } from '@sentre/senhub'
import moment from 'moment'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Space, Spin, Table, Typography } from 'antd'
import ColumAction from '../columns/columAction'
import ColumnExpiration from '../columns/columnExpiration'
import ColumnTotal from 'view/vesting/history/columns/columnTotal'
import ColumnStatus from '../columns/columnStatus'
import RowBetweenNodeTitle from 'components/rowBetweenNodeTitle'
import RowSpaceBetween from 'components/rowSpaceBetween'
import ExpandCard from 'components/expandCard'
import ColumnAmount from '../columns/columnTotal'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import useReceiveList, { ReceiveItem } from 'hooks/useReceiveList'
import { TypeDistribute } from 'model/main.controller'
import { State } from '../../constants'
import { COLUMNS_AIRDROP } from '../columns'
import useStatus from 'hooks/useStatus'

const DEFAULT_AMOUNT = 4

const VestingReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const [listVesting, setListVesting] = useState<ReceiveItem[]>([])
  const { receiveList, loading } = useReceiveList({
    type: TypeDistribute.Vesting,
  })
  const {
    ui: { width },
  } = useUI()
  const { fetchAirdropStatus } = useStatus()
  const isMobile = width < 768

  const getIndexPriorityItem = useCallback(
    async (listVesting: ReceiveItem[]) => {
      const listStatus = []
      for (const vesting of listVesting) {
        const { receiptAddress, distributorAddress, recipientData } = vesting
        const { startedAt } = recipientData
        const status = await fetchAirdropStatus({
          receipt: receiptAddress,
          startedAt: startedAt.toNumber(),
          distributor: distributorAddress,
        })
        listStatus.push(status)
      }
      if (listStatus.indexOf(State.ready) !== -1)
        return listStatus.indexOf(State.ready)
      if (listStatus.indexOf(State.waiting) !== -1)
        return listStatus.indexOf(State.waiting)
      if (listStatus.indexOf(State.claimed) !== -1)
        return listStatus.indexOf(State.claimed)
      if (listStatus.indexOf(State.expired) !== -1)
        return listStatus.indexOf(State.expired)
      return 0
    },
    [fetchAirdropStatus],
  )

  const filterVesting = useCallback(async () => {
    if (!receiveList.length) return
    const vestings: Record<string, ReceiveItem[]> = {}
    const filteredVesting: ReceiveItem[] = []
    for (const vesting of receiveList) {
      const { distributorAddress } = vesting
      if (vestings[distributorAddress]) {
        const data = [...vestings[distributorAddress]]
        data.push(vesting)
        vestings[distributorAddress] = data
        continue
      }
      vestings[distributorAddress] = [vesting]
    }

    for (const address in vestings) {
      const nextVestingData = vestings[address]
      if (nextVestingData.length === 1) filteredVesting.push(nextVestingData[0])
      else {
        const index = await getIndexPriorityItem(nextVestingData)
        let vestingItem = nextVestingData[index]
        const listChildren: ReceiveItem[] = []

        for (const vestingData of nextVestingData) {
          if (isEqual(vestingData, vestingItem)) continue
          listChildren.push(vestingData)
        }
        vestingItem = { ...vestingItem, children: listChildren }
        const { distributorAddress, recipientData, receiptAddress } =
          vestingItem
        const { startedAt } = recipientData
        const status = await fetchAirdropStatus({
          distributor: distributorAddress,
          receipt: receiptAddress,
          startedAt: startedAt.toNumber(),
        })
        if (status === State.ready) {
          filteredVesting.unshift(vestingItem)
          continue
        }

        filteredVesting.push(vestingItem)
      }
    }

    return setListVesting(filteredVesting)
  }, [fetchAirdropStatus, getIndexPriorityItem, receiveList])

  useEffect(() => {
    filterVesting()
  }, [filterVesting])

  return (
    <Spin spinning={loading}>
      <Card className="card-lightning">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row>
              <Col flex="auto">
                <Typography.Title level={5}>Vesting receive</Typography.Title>
              </Col>
              <Col>Filter</Col>
            </Row>
          </Col>
          <Col span={24}>
            {isMobile ? (
              <Fragment>
                {listVesting.slice(0, amountAirdrop).map((vesting, idx) => {
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
                              label={`Sender: ${util.shortenAddress(
                                sender,
                                4,
                              )}`}
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
                              <ColumnExpiration
                                distributorAddress={distributorAddress}
                              />
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
                                            childReciptData.startedAt.toNumber() *
                                              1000,
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
            ) : (
              <Table
                dataSource={listVesting.slice(0, amountAirdrop)}
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
              disabled={amountAirdrop >= listVesting.length}
            >
              VIEW MORE
            </Button>
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default VestingReceive
