import { useCallback, useEffect, useMemo, useState } from 'react'
import isEqual from 'react-fast-compare'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import LoadMetadata from '../loadMetadata'
import FilterReceiveList from 'components/filterHistory/filterReceiveList'
import ReceivedHistories from 'components/listHistory/listReceiveMobile'

import { State } from '../../../constants'
import useStatus from 'hooks/useStatus'
import { useReceivedList, ReceiveItem } from 'hooks/useReceivedList'
import { MerkleDistributor } from '@sentre/utility'
import { TypeDistribute } from 'model/main.controller'

import configs from 'configs'

const {
  manifest: { appId },
} = configs

const DEFAULT_AMOUNT = 4

const VestingReceive = () => {
  const [amountVesting, setAmountVesting] = useState(DEFAULT_AMOUNT)
  const [listVesting, setListVesting] = useState<ReceiveItem[]>([])
  const listReceived = useReceivedList()
  const [filteredListVesting, setFilteredListVesting] = useState<ReceiveItem[]>(
    [],
  )
  const { fetchAirdropStatus } = useStatus()

  const loading = useMemo(
    () => (listReceived === undefined ? true : false),
    [listReceived],
  )

  const receivedVestings = useMemo(() => {
    let vestingReceive: ReceiveItem[] = []
    for (const address in listReceived) {
      const { index, recipientData, children } = listReceived[address]
      const { salt } = recipientData
      const vestingSalt = MerkleDistributor.salt(
        `${appId}/${TypeDistribute.Vesting}/${index}`,
      )
      if (Buffer.compare(vestingSalt, salt) !== 0) continue
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
    if (!receivedVestings.length) return setListVesting([])
    const vestings: Record<string, ReceiveItem[]> = {}
    let filteredVesting: ReceiveItem[] = []
    const readyList: ReceiveItem[] = []
    const otherList: ReceiveItem[] = []
    for (const vesting of receivedVestings) {
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
  }, [fetchAirdropStatus, getIndexPriorityItem, receivedVestings])

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
                  receivedList={listVesting}
                  onFilter={setFilteredListVesting}
                />
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <ReceivedHistories
            receivedList={filteredListVesting.slice(0, amountVesting)}
          />
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
