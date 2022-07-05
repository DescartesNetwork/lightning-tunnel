import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useUI, util } from '@sentre/senhub'
import { MerkleDistributor } from '@sentre/utility'
import moment from 'moment'

import { Button, Card, Col, Row, Space, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import ExpandCard from 'components/expandCard'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import RowSpaceBetween from 'components/rowSpaceBetween'
import ColumnExpiration from '../columns/columnExpiration'
import ColumnStatus from '../columns/columnStatus'
import ColumAction from '../columns/columAction'
import ColumnAmount from '../columns/columnTotal'
import RowBetweenNodeTitle from 'components/rowBetweenNodeTitle'

import { State } from '../../../constants'
import { TypeDistribute } from 'model/main.controller'
import { COLUMNS_AIRDROP } from '../columns'
import useStatus from 'hooks/useStatus'
import { AppState } from 'model'
import configs from 'configs'
import { ReceiveItem } from 'model/listReceived.controller'

const DEFAULT_AMOUNT = 4

const {
  manifest: { appId },
} = configs

const AirdropReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const [listAirdrop, setListAirdrop] = useState<ReceiveItem[]>([])
  const listReceived = useSelector((state: AppState) => state.listReceived)
  const {
    ui: { width },
  } = useUI()
  const { fetchAirdropStatus } = useStatus()

  const isMobile = width < 768

  const receiveList = useMemo(() => {
    const airdropReceive: ReceiveItem[] = []
    for (const address in listReceived) {
      const { recipientData, index } = listReceived[address]
      const { salt } = recipientData
      const airdropSalt = MerkleDistributor.salt(
        `${appId}/${TypeDistribute.Airdrop}/${index}`,
      )
      if (Buffer.compare(airdropSalt, salt) !== 0) continue
      airdropReceive.push(listReceived[address])
    }
    return airdropReceive
  }, [listReceived])

  const filterAirdrops = useCallback(async () => {
    if (!receiveList.length) return
    const nextAirdrops: ReceiveItem[] = []
    for (const airdrop of receiveList) {
      const { receiptAddress, distributorAddress, recipientData } = airdrop
      const { startedAt } = recipientData
      const status = await fetchAirdropStatus({
        distributor: distributorAddress,
        receipt: receiptAddress,
        startedAt: startedAt.toNumber(),
      })
      if (status === State.ready) {
        nextAirdrops.unshift(airdrop)
        continue
      }
      nextAirdrops.push(airdrop)
    }
    return setListAirdrop(nextAirdrops)
  }, [receiveList, fetchAirdropStatus])

  useEffect(() => {
    filterAirdrops()
  }, [filterAirdrops])

  return (
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
  )
}

export default AirdropReceive
