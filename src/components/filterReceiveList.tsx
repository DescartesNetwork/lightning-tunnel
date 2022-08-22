import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { account } from '@senswap/sen-js'
import { useUI } from '@sentre/senhub'

import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import SelectExistMintToken from './selectExistMintToken'
import IonIcon from '@sentre/antd-ionicon'

import SelectTokenByStatus from './selectTokenByStatus'
import useStatus from 'hooks/useStatus'
import { ALL } from '../constants'
import { ReceiveItem } from 'hooks/useReceivedList'

type ConfirmParamsType = { mintKey: string; statusKey: string }

type FilterReceiveListMobileProps = {
  mintAddresses: string[]
  onConfirm: (selected: ConfirmParamsType) => void
}

const FilterReceiveListMobile = ({
  mintAddresses,
  onConfirm,
}: FilterReceiveListMobileProps) => {
  const [visible, setVisible] = useState(false)
  const [mintKey, setMintKey] = useState(ALL)
  const [statusKey, setStatusKey] = useState(ALL)

  const onClick = () => {
    onConfirm({ mintKey, statusKey })
    setVisible(false)
  }

  return (
    <Fragment>
      <Button
        type="text"
        icon={<IonIcon name="funnel-outline" />}
        onClick={() => setVisible(true)}
      />

      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        closable={false}
        footer={false}
        className="card-lightning"
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Space size={8} direction="vertical" style={{ width: '100%' }}>
              <Typography.Text type="secondary">
                Filter by token
              </Typography.Text>
              <SelectExistMintToken
                mintAddresses={mintAddresses}
                onChange={setMintKey}
                style={{ width: '100%' }}
              />
            </Space>
          </Col>
          <Col span={24}>
            <SelectTokenByStatus onChange={setStatusKey} value={statusKey} />
          </Col>
          <Col span={24}>
            <Button type="primary" onClick={onClick} block>
              Confirm
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

type FilterReceiveListProps = {
  listReceive: ReceiveItem[]
  onFilter: (data: ReceiveItem[]) => void
}
const FilterReceiveList = ({
  listReceive,
  onFilter,
}: FilterReceiveListProps) => {
  const [mintKey, setMintKey] = useState(ALL)
  const [statusKey, setStatusKey] = useState(ALL)
  const { fetchAirdropStatus } = useStatus()
  const {
    ui: { infix },
  } = useUI()

  const isMobile = infix === 'xs'

  const listMintAddr = useMemo(() => {
    if (!listReceive.length) return []
    let mints: string[] = []
    for (const item of listReceive) {
      const { mintAddress } = item
      if (!mints.includes(mintAddress)) mints.push(mintAddress)
    }
    return mints
  }, [listReceive])

  const validReceiveItem = useCallback(
    async (receiveItem: ReceiveItem) => {
      const {
        recipientData: { startedAt },
        receiptAddress,
        distributorAddress,
        mintAddress,
      } = receiveItem

      const mintCheck =
        account.isAddress(mintAddress) && mintKey !== ALL
          ? [mintKey].includes(mintAddress)
          : true

      const state = await fetchAirdropStatus({
        distributor: distributorAddress,
        receipt: receiptAddress,
        startedAt: startedAt.toNumber(),
      })
      const statusCheck =
        !!state && statusKey !== ALL ? [statusKey].includes(state) : true

      return mintCheck && statusCheck
    },
    [fetchAirdropStatus, mintKey, statusKey],
  )

  const filterListReceive = useCallback(async () => {
    let filteredData: ReceiveItem[] = []
    for (const itemReceive of listReceive) {
      const state = await validReceiveItem(itemReceive)
      if (state) filteredData.push(itemReceive)
    }

    if (!filteredData.length) onFilter([])
    return onFilter(filteredData)
  }, [validReceiveItem, listReceive, onFilter])

  useEffect(() => {
    filterListReceive()
  }, [filterListReceive])

  if (isMobile)
    return (
      <FilterReceiveListMobile
        mintAddresses={listMintAddr}
        onConfirm={({ mintKey, statusKey }) => {
          setMintKey(mintKey)
          setStatusKey(statusKey)
        }}
      />
    )
  return (
    <Space>
      <SelectExistMintToken
        mintAddresses={listMintAddr}
        onChange={setMintKey}
      />
      <SelectTokenByStatus onChange={setStatusKey} />
    </Space>
  )
}

export default FilterReceiveList
