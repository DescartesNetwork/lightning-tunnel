import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { MerkleDistributor } from '@sentre/utility'

import { Button, Card, Col, Row, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppState } from 'app/model'
import useCountdown, { DEFAULT_TEN_MINUTE } from 'app/hooks/useCountdown'
import { COLUMNS_AIRDROP } from './columns'
import IPFS from 'shared/pdb/ipfs'
import { HistoryRecord } from 'app/helper/history'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

const DEFAULT_AMOUNT = 4

const History = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const { history } = useSelector((state: AppState) => state)
  const { timeRemaining } = useCountdown()

  const filterHistory = useMemo(() => {
    const nextHistory: HistoryRecord[] = []
    const defaultSalt = MerkleDistributor.salt(`${appId}/airdrop/${0}`)
    try {
      for (const historyItem of history) {
        const { treeData } = historyItem
        if (!treeData) continue
        const parseData = JSON.parse(JSON.stringify(treeData)).data
        const merkleDistributor = MerkleDistributor.fromBuffer(
          Buffer.from(parseData),
        )
        const salt = merkleDistributor.receipients[0].salt
        const x = Buffer.compare(defaultSalt, salt)

        if (x !== 0) continue
        nextHistory.push(historyItem)
      }
    } catch (error) {}
    return nextHistory
  }, [history])

  const syncData = useCallback(async () => {
    if (timeRemaining !== DEFAULT_TEN_MINUTE) return
    const ipfs = new IPFS()
    try {
      for (const { treeData } of history) {
        if (!treeData) continue
        const parseData = JSON.parse(JSON.stringify(treeData)).data
        await ipfs.set(parseData)
      }
    } catch (error) {}
  }, [history, timeRemaining])

  useEffect(() => {
    syncData()
  }, [syncData])

  return (
    <Card className="card-lightning">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>History</Typography.Title>
            </Col>
            <Col>Filter</Col>
          </Row>
        </Col>
        <Col span={24}>
          <Table
            dataSource={filterHistory.slice(0, amountAirdrop)}
            pagination={false}
            columns={COLUMNS_AIRDROP}
            rowKey={(record) => record.distributorAddress}
          />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            onClick={() => setAmountAirdrop(amountAirdrop + DEFAULT_AMOUNT)}
            type="ghost"
            icon={<IonIcon name="arrow-down-outline" />}
            disabled={amountAirdrop >= filterHistory.length}
          >
            VIEW MORE
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default History
