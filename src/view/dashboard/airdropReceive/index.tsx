import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUI } from '@sentre/senhub'
import { MerkleDistributor } from '@sentre/utility'

import { Button, Card, Col, Row, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FilterReceiveList from 'components/filterReceiveList'
import ListReceiveMobile from 'components/listReceiveMobile'

import { State } from '../../../constants'
import { TypeDistribute } from 'model/main.controller'
import { COLUMNS_RECEIVE } from '../columns'
import useStatus from 'hooks/useStatus'
import configs from 'configs'
import { ReceiveItem, useReceivedList } from 'hooks/useReceivedList'

const DEFAULT_AMOUNT = 4

const {
  manifest: { appId },
} = configs

const AirdropReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const [listAirdrop, setListAirdrop] = useState<ReceiveItem[]>([])
  const listReceived = useReceivedList()

  const [filteredListAirdrop, setFilteredListAirdrop] = useState<ReceiveItem[]>(
    [],
  )
  const {
    ui: { width },
  } = useUI()
  const { fetchAirdropStatus } = useStatus()

  const isMobile = width < 768

  const loading = useMemo(
    () => (listReceived === undefined ? true : false),
    [listReceived],
  )

  const receiveList = useMemo(() => {
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
    if (!receiveList.length) return setListAirdrop([])
    let nextAirdrops: ReceiveItem[] = []
    const readyList: ReceiveItem[] = []
    const otherList: ReceiveItem[] = []
    for (const airdrop of receiveList) {
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
  }, [receiveList, fetchAirdropStatus])

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
          {isMobile ? (
            <ListReceiveMobile
              listReceive={filteredListAirdrop.slice(0, amountAirdrop)}
            />
          ) : (
            <Table
              dataSource={filteredListAirdrop.slice(0, amountAirdrop)}
              pagination={false}
              columns={COLUMNS_RECEIVE}
              rowKey={(record) => record.receiptAddress}
            />
          )}
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
