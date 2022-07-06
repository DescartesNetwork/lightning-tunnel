import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import isEqual from 'react-fast-compare'
import { useUI } from '@sentre/senhub'
import { MerkleDistributor } from '@sentre/utility'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Table, Typography } from 'antd'
import ListVestingMobile from './listVestingMobile'

import { TypeDistribute } from 'model/main.controller'
import { State } from '../../../constants'
import { COLUMNS_AIRDROP } from '../columns'
import useStatus from 'hooks/useStatus'
import { AppState } from 'model'
import { ReceiveItem } from 'model/listReceived.controller'
import configs from 'configs'
import FilterReceiveList from 'components/filterReceiveList'

const DEFAULT_AMOUNT = 4

const {
  manifest: { appId },
} = configs

const VestingReceive = () => {
  const [amountVesting, setAmountVesting] = useState(DEFAULT_AMOUNT)
  const [listVesting, setListVesting] = useState<ReceiveItem[]>([])
  const listReceived = useSelector((state: AppState) => state.listReceived)
  const [filteredListVesting, setFilteredListVesting] = useState<ReceiveItem[]>(
    [],
  )
  const {
    ui: { width },
  } = useUI()
  const { fetchAirdropStatus } = useStatus()
  const isMobile = width < 768

  const receiveList = useMemo(() => {
    let vestingReceive: ReceiveItem[] = []
    for (const address in listReceived) {
      const { index, recipientData, children } = listReceived[address]
      const { salt } = recipientData
      const airdropSalt = MerkleDistributor.salt(
        `${appId}/${TypeDistribute.Vesting}/${index}`,
      )
      if (Buffer.compare(airdropSalt, salt) !== 0) continue
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
        const { startedAt } = recipientData
        const status = await fetchAirdropStatus({
          distributor: distributorAddress,
          receipt: receiptAddress,
          startedAt: startedAt.toNumber(),
        })
        if (status === State.ready) {
          filteredVesting.unshift(vestingItem)
          continue
        }

        filteredVesting.push(vestingItem)
      }
    }

    return setListVesting(filteredVesting)
  }, [fetchAirdropStatus, getIndexPriorityItem, receiveList])

  useEffect(() => {
    filterVesting()
  }, [filterVesting])

  return (
    <Card className="card-lightning">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>Vesting receive</Typography.Title>
            </Col>
            <Col>
              <FilterReceiveList
                listReceive={listVesting}
                onFilter={setFilteredListVesting}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {isMobile ? (
            <ListVestingMobile
              listVesting={filteredListVesting}
              amountVesting={amountVesting}
            />
          ) : (
            <Table
              dataSource={filteredListVesting.slice(0, amountVesting)}
              pagination={false}
              columns={COLUMNS_AIRDROP}
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
