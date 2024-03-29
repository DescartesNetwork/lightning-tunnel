import { useState } from 'react'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { TypeDistribute } from 'model/main.controller'
import useSentList, { ItemSent } from 'hooks/useSentList'
import FilterSentList from 'components/filterHistory/filterSentList'
import SentHistories from '../../../components/listHistory/sentHistories'

const DEFAULT_AMOUNT = 4

const History = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const { loading } = useSentList({ type: TypeDistribute.Airdrop })
  const [filteredListHistory, setFilteredListHistory] = useState<ItemSent[]>([])

  return (
    <Card loading={loading} className="card-lightning">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Space>
                <Typography.Title level={5}>History</Typography.Title>
                <Typography.Text className="amount-airdrop">
                  {filteredListHistory.length}
                </Typography.Text>
              </Space>
            </Col>
            <Col>
              <FilterSentList
                onFilter={setFilteredListHistory}
                type={TypeDistribute.Airdrop}
              />
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <SentHistories
            sentList={filteredListHistory.slice(0, amountAirdrop)}
          />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            onClick={() => setAmountAirdrop(amountAirdrop + DEFAULT_AMOUNT)}
            type="ghost"
            icon={<IonIcon name="arrow-down-outline" />}
            disabled={amountAirdrop >= filteredListHistory.length}
          >
            VIEW MORE
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default History
