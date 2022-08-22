import { useCallback, useEffect, useMemo, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useUI } from '@sentre/senhub'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Space, Table, Typography } from 'antd'
import FilterReceiveList from 'components/filterReceiveList'
import ListReceiveMobile from 'components/listReceiveMobile'
import LoadMetadata from '../loadMetadata'

import { TypeDistribute } from 'model/main.controller'
import { State } from '../../../constants'
import { COLUMNS_RECEIVE } from '../columns'
import useStatus from 'hooks/useStatus'
import { useReceivedList, ReceiveItem } from 'hooks/useReceivedList'

const DEFAULT_AMOUNT = 4

const VestingReceive = () => {
  const [amountVesting, setAmountVesting] = useState(DEFAULT_AMOUNT)
  const [listVesting, setListVesting] = useState<ReceiveItem[]>([])
  const listReceived = useReceivedList({ type: TypeDistribute.Vesting })
  const [filteredListVesting, setFilteredListVesting] = useState<ReceiveItem[]>(
    [],
  )
  const {
    ui: { width },
  } = useUI()
  const { fetchAirdropStatus } = useStatus()
  const isMobile = width < 768

  const loading = useMemo(
    () => (listReceived === undefined ? true : false),
    [listReceived],
  )

  console.log(listReceived, 'listReceived')

  const receiveList = useMemo(() => {
    let vestingReceive: ReceiveItem[] = []
    for (const address in listReceived) {
      const { children } = listReceived[address]
      if (!children) continue
      vestingReceive = vestingReceive.concat(children)
    }
    return vestingReceive
  }, [listReceived])

  const getIndexPriorityItem = useCallback(
    async (listVesting: ReceiveItem[]) => {
      const listStatus = []
      for (const vesting of listVesting) {
        const { receiptAddress, distributorAddress, recipientData } = vesting
        const { startedAt } = recipientData
        const status = await fetchAirdropStatus({
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

  const filterVesting = useCallback(async () => {
    if (!receiveList.length) return setListVesting([])
    const vestings: Record<string, ReceiveItem[]> = {}
    let filteredVesting: ReceiveItem[] = []
    const readyList: ReceiveItem[] = []
    const otherList: ReceiveItem[] = []

    for (const vesting of receiveList) {
      const { distributorAddress } = vesting
      if (vestings[distributorAddress]) {
        const data = [...vestings[distributorAddress]]
        data.push(vesting)
        vestings[distributorAddress] = data
        continue
      }
      vestings[distributorAddress] = [vesting]
    }

    for (const address in vestings) {
      const nextVestingData = vestings[address]
      if (nextVestingData.length === 1) filteredVesting.push(nextVestingData[0])
      else {
        const index = await getIndexPriorityItem(nextVestingData)
        let vestingItem = nextVestingData[index]
        const listChildren: ReceiveItem[] = []

        for (const vestingData of nextVestingData) {
          if (isEqual(vestingData, vestingItem)) continue
          listChildren.push(vestingData)
        }
        vestingItem = { ...vestingItem, children: listChildren }
        const { distributorAddress, recipientData, receiptAddress } =
          vestingItem
        const { startedAt } = recipientData
        const status = await fetchAirdropStatus({
          distributor: distributorAddress,
          receipt: receiptAddress,
          startedAt: startedAt.toNumber(),
        })
        if (status === State.ready) {
          readyList.push(vestingItem)
          continue
        }

        otherList.push(vestingItem)
      }
    }

    readyList.sort(
      (a, b) =>
        Number(b.recipientData.startedAt) - Number(a.recipientData.startedAt),
    )
    filteredVesting = readyList.concat(otherList)

    return setListVesting(filteredVesting)
  }, [fetchAirdropStatus, getIndexPriorityItem, receiveList])

  console.log(listVesting, 'listVesting')

  useEffect(() => {
    filterVesting()
  }, [filterVesting])

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
                  listReceive={listVesting}
                  onFilter={setFilteredListVesting}
                />
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {isMobile ? (
            <ListReceiveMobile
              listReceive={filteredListVesting.slice(0, amountVesting)}
            />
          ) : (
            <Table
              dataSource={filteredListVesting.slice(0, amountVesting)}
              pagination={false}
              columns={COLUMNS_RECEIVE}
              rowKey={(record) => record.receiptAddress}
            />
          )}
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            onClick={() => setAmountVesting(amountVesting + DEFAULT_AMOUNT)}
            type="ghost"
            icon={<IonIcon name="arrow-down-outline" />}
            disabled={amountVesting >= filteredListVesting.length}
          >
            VIEW MORE
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default VestingReceive
