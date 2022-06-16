import { useCallback, useEffect, useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Spin, Table, Typography } from 'antd'

import { COLUMNS_AIRDROP } from './columns'
import useListAirdrop, { Airdrop } from 'app/hooks/airdrop/useListAirdrop'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import { getStatus } from 'app/hooks/airdrop/useStatusAirdrop'
import { State } from 'app/constants'

const DEFAULT_AMOUNT = 4

const AirdropReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const { airdrops, loading } = useListAirdrop()
  const [listAirdrop, setListAirdrop] = useState<Airdrop[]>([])
  const distributors = useSelector((state: AppState) => state.distributors)

  const filterAirdrops = useCallback(async () => {
    if (!airdrops.length) return
    const nextAirdrops: Airdrop[] = []
    for (const airdrop of airdrops) {
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
  }, [airdrops, distributors])

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
            <Table
              dataSource={listAirdrop.slice(0, amountAirdrop)}
              pagination={false}
              columns={COLUMNS_AIRDROP}
              rowKey={(record) => record.receiptAddress}
            />
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
