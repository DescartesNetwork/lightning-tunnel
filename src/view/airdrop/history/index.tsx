import { useState } from 'react'
import { useUI } from '@sentre/senhub'

import { Button, Card, Col, Row, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FilterSentList from 'components/filterSentList'
import ListSentMobile from '../../../components/listSentMobile'
import { HISTORY_COLUMNS } from 'components/historyColumns'

import { TypeDistribute } from 'model/main.controller'
import useSentList, { ItemSent } from 'hooks/useSentList'

const DEFAULT_AMOUNT = 4

const History = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const { loading, listHistory } = useSentList({ type: TypeDistribute.Airdrop })
  const [filteredListHistory, setFilteredListHistory] = useState<ItemSent[]>([])
  const width = useUI().ui.width

  const isMobile = width < 768

  return (
    <Card loading={loading} className="card-lightning">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>History</Typography.Title>
            </Col>
            <Col>
              <FilterSentList
                listSent={listHistory}
                onFilter={setFilteredListHistory}
              />
            </Col>
          </Row>
        </Col>

        {isMobile ? (
          <Col span={24}>
            <ListSentMobile
              listSent={filteredListHistory.slice(0, amountAirdrop)}
            />
          </Col>
        ) : (
          <Col span={24}>
            <Table
              dataSource={filteredListHistory.slice(0, amountAirdrop)}
              pagination={false}
              columns={HISTORY_COLUMNS}
              rowKey={(record) => record.distributorAddress}
            />
          </Col>
        )}

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
