import moment from 'moment'

import { Col, Row, Space, Typography } from 'antd'

import ExpandCard from 'components/expandCard'
import RowBetweenNodeTitle from 'components/rowBetweenNodeTitle'
import ColumnTotal from '../view/airdrop/history/columns/columnTotal'
import ActionButton from '../view/airdrop/history/columns/actionButton'
import RowSpaceBetween from 'components/rowSpaceBetween'
import UnlockDateColumn from '../view/airdrop/history/columns/unlockDateColumn'

import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import { ItemSent } from 'hooks/useSentList'

const HistoryCard = ({ itemSent }: { itemSent: ItemSent }) => {
  const {
    distributorAddress,
    mint: mintAddress,
    time,
    total,
    treeData,
    remaining,
  } = itemSent
  return (
    <ExpandCard
      style={{
        border: '1px solid transparent',
        borderImageSlice: '0 0 1 0',
        borderImageWidth: 1,
        borderImageSource:
          'linear-gradient(90deg,transparent, #4F5B5C, transparent)',
      }}
      cardId={`card_airdrop_${distributorAddress}`}
      cardHeader={
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <RowBetweenNodeTitle
              title={
                <Space>
                  <MintAvatar mintAddress={mintAddress} />
                  <Space size={6}>
                    <ColumnTotal total={total.toString()} mint={mintAddress} />
                    <MintSymbol mintAddress={mintAddress} />
                  </Space>
                </Space>
              }
            >
              <ActionButton
                remaining={remaining}
                distributorAddress={distributorAddress}
              />
            </RowBetweenNodeTitle>
          </Col>
        </Row>
      }
      key={distributorAddress}
    >
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <RowSpaceBetween
            label="Created time"
            value={
              <Typography.Text>
                {moment(time).format('MMM DD, YYYY HH:mm')}
              </Typography.Text>
            }
          />
        </Col>
        <Col span={24}>
          <RowSpaceBetween
            label="Unlock time"
            value={<UnlockDateColumn treeData={treeData} />}
          />
        </Col>
      </Row>
    </ExpandCard>
  )
}

export default HistoryCard
