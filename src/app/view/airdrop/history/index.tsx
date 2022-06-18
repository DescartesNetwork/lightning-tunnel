import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MerkleDistributor } from '@sentre/utility'

import { Button, Card, Col, Row, Spin, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppState } from 'app/model'
import useCountdown, { DEFAULT_TEN_MINUTE } from 'app/hooks/useCountdown'
import { COLUMNS_AIRDROP } from './columns'
import IPFS from 'shared/pdb/ipfs'
import { HistoryRecord } from 'app/helper/history'
import configs from 'app/configs'
import { CURRENT_TIME } from 'app/constants'
import { getBalanceTreasury } from 'app/hooks/useCanRevoke'

const {
  manifest: { appId },
} = configs

const DEFAULT_AMOUNT = 4

const History = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const [listHistory, setListHistory] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(false)
  const { history } = useSelector((state: AppState) => state)
  const { timeRemaining } = useCountdown()
  const distributors = useSelector((state: AppState) => state.distributors)

  const fetchHistory = useCallback(async () => {
    const nextHistory: HistoryRecord[] = []
    try {
      setLoading(true)
      const airdropSalt = MerkleDistributor.salt(`${appId}/airdrop/${0}`)
      for (const historyItem of history) {
        const { treeData, distributorAddress } = historyItem
        const endedAt = distributors[distributorAddress].endedAt
        const endTime = endedAt.toNumber() * 1000
        const balance = await getBalanceTreasury(distributorAddress)

        if (!treeData) continue
        const parseData = JSON.parse(JSON.stringify(treeData)).data
        const merkleDistributor = MerkleDistributor.fromBuffer(
          Buffer.from(parseData),
        )
        const salt = merkleDistributor.receipients[0].salt
        const x = Buffer.compare(airdropSalt, salt)

        if (x !== 0) continue
        if (endTime < CURRENT_TIME && endTime && balance) {
          nextHistory.unshift(historyItem)
          continue
        }
        nextHistory.push(historyItem)
      }
    } catch (error) {
    } finally {
      setLoading(false)
      return setListHistory(nextHistory)
    }
  }, [distributors, history])

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

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <Spin spinning={loading}>
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
              dataSource={listHistory.slice(0, amountAirdrop)}
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
              disabled={amountAirdrop >= listHistory.length}
            >
              VIEW MORE
            </Button>
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default History
