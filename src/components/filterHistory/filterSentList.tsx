import { Fragment, useCallback, useEffect, useState } from 'react'
import { useUI } from '@sentre/senhub'

import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { ItemSent } from 'hooks/useSentList'
import { ALL } from '../../constants'
import FilterSelection from './filterSelection'
import { useFilterSentList } from 'hooks/useFilterSentList'
import { TypeDistribute } from 'model/main.controller'

const TIME_OPTIONS = [7, 30, 90]

type ConfirmParamsType = { mintKey: string; timeKey: string }
type FilterSentListMobileProps = {
  mintAddressess: string[]
  onConfirm: (selected: ConfirmParamsType) => void
}

const FilterSentListMobile = ({
  mintAddressess,
  onConfirm,
}: FilterSentListMobileProps) => {
  const [visible, setVisible] = useState(false)
  const [mintKey, setMintKey] = useState(ALL)
  const [timeKey, setTimeKey] = useState(ALL)

  const onClick = () => {
    onConfirm({ mintKey, timeKey })
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
              <FilterSelection
                options={mintAddressess}
                onChange={setMintKey}
                style={{ width: '100%' }}
              />
            </Space>
          </Col>
          <Col span={24}>
            <FilterSelection
              defaultValue="All time"
              options={TIME_OPTIONS}
              onChange={setTimeKey}
              value={timeKey}
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

type FilterSentListProps = {
  onFilter: (data: ItemSent[]) => void
  type: TypeDistribute
}
const FilterSentList = ({ onFilter, type }: FilterSentListProps) => {
  const [mintKey, setMintKey] = useState(ALL)
  const [timeKey, setTimeKey] = useState(ALL)
  const {
    ui: { infix },
  } = useUI()
  const { filterSentList, sentMints } = useFilterSentList(type)

  const onChange = useCallback(() => {
    const senList = filterSentList({ mintAddress: mintKey, time: timeKey })
    onFilter(senList)
  }, [filterSentList, mintKey, onFilter, timeKey])

  useEffect(() => {
    onChange()
  }, [onChange])

  const isMobile = infix === 'xs'

  if (isMobile)
    return (
      <FilterSentListMobile
        mintAddressess={sentMints}
        onConfirm={({ mintKey, timeKey }) => {
          setMintKey(mintKey)
          setTimeKey(timeKey)
        }}
      />
    )

  return (
    <Space>
      <FilterSelection options={sentMints} onChange={setMintKey} />
      <FilterSelection
        options={TIME_OPTIONS}
        defaultValue="All time"
        onChange={setTimeKey}
      />
    </Space>
  )
}

export default FilterSentList
