import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import LoadMetadata from '../loadMetadata'
import FilterReceiveList from 'components/filterHistory/filterReceiveList'
import ReceivedHistories from 'components/listHistory/listReceiveMobile'

import { State } from '../../../constants'
import useStatus from 'hooks/useStatus'
import { ReceiveItem, useReceivedList } from 'hooks/useReceivedList'
import { MerkleDistributor } from '@sentre/utility'
import { TypeDistribute } from 'model/main.controller'
import configs from 'configs'

const {
  manifest: { appId },
} = configs

const DEFAULT_AMOUNT = 4

const AirdropReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const [listAirdrop, setListAirdrop] = useState<ReceiveItem[]>([])
  const listReceived = useReceivedList()
  const [filteredListAirdrop, setFilteredListAirdrop] = useState<ReceiveItem[]>(
    [],
  )

  const { fetchAirdropStatus } = useStatus()

  const loading = useMemo(
    () => (listReceived === undefined ? true : false),
    [listReceived],
  )

  const receivedAirdrops = useMemo(() => {
    const airdropReceive: ReceiveItem[] = []
    for (const address in listReceived) {
      const { recipientData, index } = listReceived[address]
      const { salt } = recipientData
      const airdropSalt_v2 = MerkleDistributor.salt(
        `${appId}/${TypeDistribute.Airdrop}/${index}`,
      )
      const airdropSalt_v1 = MerkleDistributor.salt(index.toString())
      if (
        Buffer.compare(airdropSalt_v2, salt) === 0 ||
        Buffer.compare(airdropSalt_v1, salt) === 0
      )
        airdropReceive.push(listReceived[address])
    }

    return airdropReceive
  }, [listReceived])

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
              <Space>
                <LoadMetadata />
                <FilterReceiveList
                  listReceive={listAirdrop}
                  onFilter={setFilteredListAirdrop}
                />
              </Space>
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
