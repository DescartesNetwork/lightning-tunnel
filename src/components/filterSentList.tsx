import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { account } from '@senswap/sen-js'
import { useUI } from '@sentre/senhub'

import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import SelectExistMintToken from './selectExistMintToken'
import SelectTokenByTime from './selectTokenByTime'
import IonIcon from '@sentre/antd-ionicon'

import { ItemSent } from 'hooks/useSentList'
import { ALL, ONE_DAY } from '../constants'

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
              <SelectExistMintToken
                mintAddresses={mintAddressess}
                onChange={setMintKey}
                style={{ width: '100%' }}
              />
            </Space>
          </Col>
          <Col span={24}>
            <SelectTokenByTime onChange={setTimeKey} value={timeKey} />
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
  listSent: ItemSent[]
  onFilter: (data: ItemSent[]) => void
}
const FilterSentList = ({ listSent, onFilter }: FilterSentListProps) => {
  const [mintKey, setMintKey] = useState(ALL)
  const [timeKey, setTimeKey] = useState(ALL)
  const {
    ui: { infix },
  } = useUI()

  const isMobile = infix === 'xs'

  const listMintAddr = useMemo(() => {
    if (!listSent.length) return []
    let mints: string[] = []
    for (const item of listSent) {
      const { mint: mintAddress } = item
      if (!mints.includes(mintAddress)) mints.push(mintAddress)
    }
    return mints
  }, [listSent])

  const validSentItem = useCallback(
    (itemSent: ItemSent) => {
      const { time, mint: mintAddress } = itemSent
      const createAt = Number(new Date(time))

      const mintCheck =
        account.isAddress(mintAddress) && mintKey !== ALL
          ? [mintKey].includes(mintAddress)
          : true

      const timeCheck =
        !!createAt && timeKey !== ALL
          ? Date.now() - createAt < Number(timeKey) * ONE_DAY
          : true

      return mintCheck && timeCheck
    },
    [mintKey, timeKey],
  )

  const filteredListSent = useMemo(() => {
    const filteredData = listSent.filter((itemSent) => validSentItem(itemSent))
    if (!filteredData.length) return []
    return filteredData
  }, [validSentItem, listSent])

  useEffect(() => {
    onFilter(filteredListSent)
  }, [filteredListSent, onFilter])

  if (isMobile)
    return (
      <FilterSentListMobile
        mintAddressess={listMintAddr}
        onConfirm={({ mintKey, timeKey }) => {
          setMintKey(mintKey)
          setTimeKey(timeKey)
        }}
      />
    )

  return (
    <Space>
      <SelectExistMintToken
        mintAddresses={listMintAddr}
        onChange={setMintKey}
      />
      <SelectTokenByTime onChange={setTimeKey} />
    </Space>
  )
}

export default FilterSentList
