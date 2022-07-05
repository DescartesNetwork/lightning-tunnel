import { useState } from 'react'
import { useUI } from '@sentre/senhub'

import { Button, Card, Col, Row, Spin, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AirdropCard from './airdropCard'

import { COLUMNS_AIRDROP } from './columns'
import { TypeDistribute } from 'model/main.controller'
import useSentList from 'hooks/useSentList'

const DEFAULT_AMOUNT = 4

const History = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const { loading, listHistory } = useSentList({ type: TypeDistribute.Airdrop })
  const {
    ui: { width },
  } = useUI()

  const isMobile = width < 768

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

          {isMobile ? (
            <Col span={24}>
              {listHistory.slice(0, amountAirdrop).map((history) => (
                <AirdropCard
                  itemSent={history}
                  key={history.distributorAddress}
                />
              ))}
            </Col>
          ) : (
            <Col span={24}>
              <Table
                dataSource={listHistory.slice(0, amountAirdrop)}
                pagination={false}
                columns={COLUMNS_AIRDROP}
                rowKey={(record) => record.distributorAddress}
              />
            </Col>
          )}

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
