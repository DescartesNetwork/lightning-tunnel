import { useCallback, useEffect, useState } from 'react'

import { Button, Card, Col, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FilterReceiveList from 'components/filterHistory/filterReceiveList'
import ReceivedHistories from 'components/listHistory/listReceiveMobile'

import { State } from '../../../constants'
import useStatus from 'hooks/useStatus'
import { ReceiveItem, useReceivedList } from 'hooks/useReceivedList'

const DEFAULT_AMOUNT = 4

const AirdropReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const [listAirdrop, setListAirdrop] = useState<ReceiveItem[]>([])
  const { getReceivedAirdops, loading } = useReceivedList()
  const [filteredListAirdrop, setFilteredListAirdrop] = useState<ReceiveItem[]>(
    [],
  )
  const { fetchAirdropStatus } = useStatus()
  const receivedAirdrops = getReceivedAirdops()

  const filterAirdrops = useCallback(async () => {
    if (!receivedAirdrops.length) return setListAirdrop([])
    let nextAirdrops: ReceiveItem[] = []
    const readyList: ReceiveItem[] = []
    const otherList: ReceiveItem[] = []
    for (const airdrop of receivedAirdrops) {
      const { receiptAddress, distributorAddress, recipientData } = airdrop
      const { startedAt } = recipientData
      const status = await fetchAirdropStatus({
        distributor: distributorAddress,
        receipt: receiptAddress,
        startedAt: startedAt.toNumber(),
      })
      if (status === State.ready) {
        readyList.push(airdrop)
        continue
      }
      otherList.push(airdrop)
    }
    readyList.sort(
      (a, b) =>
        Number(b.recipientData.startedAt) - Number(a.recipientData.startedAt),
    )
    nextAirdrops = readyList.concat(otherList)
    return setListAirdrop(nextAirdrops)
  }, [receivedAirdrops, fetchAirdropStatus])

  useEffect(() => {
    filterAirdrops()
  }, [filterAirdrops])

  return (
    <Card loading={loading} className="card-lightning">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>Airdrop receive</Typography.Title>
            </Col>
            <Col>
              <FilterReceiveList
                listReceive={listAirdrop}
                onFilter={setFilteredListAirdrop}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <ReceivedHistories
            receivedList={filteredListAirdrop.slice(0, amountAirdrop)}
          />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            onClick={() => setAmountAirdrop(amountAirdrop + DEFAULT_AMOUNT)}
            type="ghost"
            icon={<IonIcon name="arrow-down-outline" />}
            disabled={amountAirdrop >= filteredListAirdrop.length}
          >
            VIEW MORE
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default AirdropReceive
