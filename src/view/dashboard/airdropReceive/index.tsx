import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useUI } from '@sentre/senhub'
import { MerkleDistributor } from '@sentre/utility'

import { Button, Card, Col, Row, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import ListAirdropMobile from './listAirdropMobile'

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
            <ListAirdropMobile
              listAirdrop={listAirdrop}
              amountAirdrop={amountAirdrop}
            />
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
