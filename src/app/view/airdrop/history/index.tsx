import { useState } from 'react'

import { Button, Card, Col, Row, Spin, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { COLUMNS_AIRDROP } from './columns'
import useSentList from 'app/hooks/useSentList'
import { TypeDistribute } from 'app/model/main.controller'

const DEFAULT_AMOUNT = 4

const History = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const { loading, listHistory } = useSentList({ type: TypeDistribute.Airdrop })

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
