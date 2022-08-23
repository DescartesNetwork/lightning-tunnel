import { useMemo, useState } from 'react'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import LoadMetadata from '../loadMetadata'
import FilterReceiveList from 'components/filterHistory/filterReceiveList'
import ReceivedHistories from 'components/listHistory/listReceiveMobile'

import { State } from '../../../constants'
import useStatus from 'hooks/useStatus'
import { ReceiveItem, useReceivedList } from 'hooks/useReceivedList'
import { TypeDistribute } from 'model/main.controller'

const DEFAULT_AMOUNT = 4

const AirdropReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const listReceived = useReceivedList({ type: TypeDistribute.Airdrop })
  const [filteredListAirdrop, setFilteredListAirdrop] = useState<ReceiveItem[]>(
    [],
  )
  const { fetchAirdropStatus } = useStatus()

  const loading = useMemo(
    () => (listReceived === undefined ? true : false),
    [listReceived],
  )

  const sortedData = filteredListAirdrop.sort((a, b) => {
    const { distributorAddress, receiptAddress, recipientData } = a
    const status = fetchAirdropStatus({
      distributor: distributorAddress,
      receipt: receiptAddress,
      startedAt: recipientData.startedAt.toNumber(),
    })

    if (status === State.ready) return -1

    return 0
  })

  return (
    <Card loading={loading} className="card-lightning">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Space>
                <Typography.Title level={5}>Airdrop receive</Typography.Title>
                <Typography.Text className="amount-airdrop">
                  {filteredListAirdrop.length}
                </Typography.Text>
              </Space>
            </Col>
            <Col>
              <Space>
                <LoadMetadata />
                <FilterReceiveList
                  receivedList={listReceived || []}
                  onFilter={setFilteredListAirdrop}
                />
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <ReceivedHistories
            receivedList={sortedData.slice(0, amountAirdrop)}
          />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            onClick={() => setAmountAirdrop(amountAirdrop + DEFAULT_AMOUNT)}
            type="ghost"
            icon={<IonIcon name="arrow-down-outline" />}
            disabled={amountAirdrop >= sortedData.length}
          >
            VIEW MORE
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default AirdropReceive
