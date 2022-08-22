import { useCallback, useEffect, useMemo, useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import LoadMetadata from '../loadMetadata'
import FilterReceiveList from 'components/filterHistory/filterReceiveList'
import ReceivedHistories from 'components/listHistory/listReceiveMobile'

import { State } from '../../../constants'
import useStatus from 'hooks/useStatus'
import { useReceivedList, ReceiveItem } from 'hooks/useReceivedList'
import { TypeDistribute } from 'model/main.controller'

const DEFAULT_AMOUNT = 4

const VestingReceive = () => {
  const [amountVesting, setAmountVesting] = useState(DEFAULT_AMOUNT)
  const [listVesting, setListVesting] = useState<ReceiveItem[]>([])
  const listReceived = useReceivedList({ type: TypeDistribute.Vesting })
  const [filteredListVesting, setFilteredListVesting] = useState<ReceiveItem[]>(
    [],
  )
  const { fetchAirdropStatus } = useStatus()

  const loading = useMemo(
    () => (listReceived === undefined ? true : false),
    [listReceived],
  )

  const getIndexPriorityItem = useCallback(
    async (listVesting: ReceiveItem[]) => {
      const listStatus = []
      for (const vesting of listVesting) {
        const { receiptAddress, distributorAddress, recipientData } = vesting
        const { startedAt } = recipientData
        const status = fetchAirdropStatus({
          receipt: receiptAddress,
          startedAt: startedAt.toNumber(),
          distributor: distributorAddress,
        })
        listStatus.push(status)
      }
      if (listStatus.indexOf(State.ready) !== -1)
        return listStatus.indexOf(State.ready)
      if (listStatus.indexOf(State.waiting) !== -1)
        return listStatus.indexOf(State.waiting)
      if (listStatus.indexOf(State.claimed) !== -1)
        return listStatus.indexOf(State.claimed)
      if (listStatus.indexOf(State.expired) !== -1)
        return listStatus.indexOf(State.expired)
      return 0
    },
    [fetchAirdropStatus],
  )

  const getAirdropByAddress = useCallback(
    (address: string) => {
      if (!listReceived) return []
      return listReceived.filter(
        ({ distributorAddress }) => distributorAddress === address,
      )
    },

    [listReceived],
  )

  const formatData = useCallback(async () => {
    if (!listReceived) return
    const nextListReceived: ReceiveItem[] = []
    const mapVesting = new Map<string, ReceiveItem[]>()
    for (const { distributorAddress } of listReceived) {
      const data = getAirdropByAddress(distributorAddress)
      mapVesting.set(distributorAddress, data)
    }

    //Format data by status priority
    mapVesting.forEach(async (value: ReceiveItem[]) => {
      const index = await getIndexPriorityItem(value)
      const parentData = value[index]
      const children = value.filter(({ index }) => index !== parentData.index)
      const receiveRecord: ReceiveItem = { ...parentData, children }
      nextListReceived.push(receiveRecord)
    })

    return setListVesting(nextListReceived)
  }, [getAirdropByAddress, getIndexPriorityItem, listReceived])

  const sortedData = listVesting.sort((a, b) => {
    const { distributorAddress, receiptAddress, recipientData } = a
    const status = fetchAirdropStatus({
      distributor: distributorAddress,
      receipt: receiptAddress,
      startedAt: recipientData.startedAt.toNumber(),
    })

    console.log(status, 'status')
    if (status === State.ready) return -1

    return 0
  })

  useEffect(() => {
    formatData()
  }, [formatData])

  return (
    <Card loading={loading} className="card-lightning">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>Vesting receive</Typography.Title>
            </Col>
            <Col>
              <Space>
                <LoadMetadata />
                <FilterReceiveList
                  receivedList={sortedData}
                  onFilter={setFilteredListVesting}
                />
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <ReceivedHistories
            receivedList={sortedData.slice(0, amountVesting)}
          />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            onClick={() => setAmountVesting(amountVesting + DEFAULT_AMOUNT)}
            type="ghost"
            icon={<IonIcon name="arrow-down-outline" />}
            disabled={amountVesting >= sortedData.length}
          >
            VIEW MORE
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default VestingReceive
