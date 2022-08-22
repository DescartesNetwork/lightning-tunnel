import { Fragment, useCallback, useEffect, useState } from 'react'
import { useUI } from '@sentre/senhub'

import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FilterSelection from './filterSelection'

import { ALL, State } from '../../constants'
import { ReceiveItem } from 'hooks/useReceivedList'
import { useFilterReceiceList } from 'hooks/useFilterReceiveList'

export const STATUS_OPTIONS = [
  State.ready,
  State.waiting,
  State.claimed,
  State.expired,
]

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
              <FilterSelection options={mintAddresses} onChange={setMintKey} />
            </Space>
          </Col>
          <Col span={24}>
            <FilterSelection
              defaultValue="All status"
              options={STATUS_OPTIONS}
              onChange={setStatusKey}
              value={statusKey}
            />
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
  receivedList: ReceiveItem[]
  onFilter: (data: ReceiveItem[]) => void
}
const FilterReceiveList = ({
  onFilter,
  receivedList,
}: FilterReceiveListProps) => {
  const [mintKey, setMintKey] = useState(ALL)
  const [statusKey, setStatusKey] = useState(ALL)
  const {
    ui: { infix },
  } = useUI()
  const { filterReceiveList, getReceiveMints } =
    useFilterReceiceList(receivedList)
  const receiveMints = getReceiveMints()

  const onChange = useCallback(async () => {
    const received = await filterReceiveList({
      mintAddress: mintKey,
      status: statusKey,
    })
    onFilter(received)
  }, [filterReceiveList, mintKey, onFilter, statusKey])

  useEffect(() => {
    onChange()
  }, [onChange])

  const isMobile = infix === 'xs'

  if (isMobile)
    return (
      <FilterReceiveListMobile
        mintAddresses={receiveMints}
        onConfirm={({ mintKey, statusKey }) => {
          setMintKey(mintKey)
          setStatusKey(statusKey)
        }}
      />
    )
  return (
    <Space>
      <FilterSelection options={receiveMints} onChange={setMintKey} />
      <FilterSelection
        options={STATUS_OPTIONS}
        defaultValue="All status"
        onChange={setStatusKey}
      />
    </Space>
  )
}

export default FilterReceiveList
