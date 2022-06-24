import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import isEqual from 'react-fast-compare'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Spin, Table, Typography } from 'antd'

import { COLUMNS_AIRDROP } from '../columns'
import useReceiveList, { ReceiveItem } from 'app/hooks/useReceiveList'
import { TypeDistribute } from 'app/model/main.controller'
import { AppState } from 'app/model'
import { getStatus } from 'app/hooks/useStatus'
import { State } from 'app/constants'

const DEFAULT_AMOUNT = 4

const VestingReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const [listVesting, setListVesting] = useState<ReceiveItem[]>([])
  const { receiveList, loading } = useReceiveList({
    type: TypeDistribute.Vesting,
  })
  const distributors = useSelector((state: AppState) => state.distributors)

  const getIndexPriorityItem = useCallback(
    async (listVesting: ReceiveItem[]) => {
      const listStatus = []
      for (const vesting of listVesting) {
        const { receiptAddress, distributorAddress, recipientData } = vesting
        const { startedAt } = recipientData
        const endedAt = distributors[distributorAddress].endedAt
        const status = await getStatus(
          receiptAddress,
          startedAt.toNumber(),
          endedAt,
        )
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
    [distributors],
  )

  const filterVesting = useCallback(async () => {
    if (!receiveList.length) return
    const vestings: Record<string, ReceiveItem[]> = {}
    const filteredVesting: ReceiveItem[] = []
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
        const endedAt = distributors[distributorAddress].endedAt
        const { startedAt } = recipientData
        const status = await getStatus(
          receiptAddress,
          startedAt.toNumber(),
          endedAt,
        )
        if (status === State.ready) {
          filteredVesting.unshift(vestingItem)
          continue
        }

        filteredVesting.push(vestingItem)
      }
    }

    return setListVesting(filteredVesting)
  }, [distributors, getIndexPriorityItem, receiveList])

  useEffect(() => {
    filterVesting()
  }, [filterVesting])

  return (
    <Spin spinning={loading}>
      <Card className="card-lightning">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row>
              <Col flex="auto">
                <Typography.Title level={5}>Vesting receive</Typography.Title>
              </Col>
              <Col>Filter</Col>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              dataSource={listVesting.slice(0, amountAirdrop)}
              pagination={false}
              columns={COLUMNS_AIRDROP}
              rowKey={(record) => record.receiptAddress}
            />
          </Col>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              onClick={() => setAmountAirdrop(amountAirdrop + DEFAULT_AMOUNT)}
              type="ghost"
              icon={<IonIcon name="arrow-down-outline" />}
              disabled={amountAirdrop >= listVesting.length}
            >
              VIEW MORE
            </Button>
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default VestingReceive
