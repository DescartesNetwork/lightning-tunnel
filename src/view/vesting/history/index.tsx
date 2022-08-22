import { useState } from 'react'

import { Button, Card, Col, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FilterSentList from 'components/filterHistory/filterSentList'

import useSentList, { ItemSent } from 'hooks/useSentList'
import { TypeDistribute } from 'model/main.controller'
import SentHistories from 'components/listHistory/sentHistories'

const DEFAULT_AMOUNT = 4

const History = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const { loading } = useSentList({ type: TypeDistribute.Vesting })
  const [filteredSentToken, setFilteredSentToken] = useState<ItemSent[]>([])

  return (
    <Card loading={loading} className="card-lightning">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>History</Typography.Title>
            </Col>
            <Col>
              <FilterSentList onFilter={setFilteredSentToken} />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <SentHistories sentList={filteredSentToken.slice(0, amountAirdrop)} />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            onClick={() => setAmountAirdrop(amountAirdrop + DEFAULT_AMOUNT)}
            type="ghost"
            icon={<IonIcon name="arrow-down-outline" />}
            disabled={amountAirdrop >= filteredSentToken.length}
          >
            VIEW MORE
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default History
