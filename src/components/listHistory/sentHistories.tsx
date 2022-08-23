import { Fragment } from 'react'
import moment from 'moment'
import { useInfix, Infix } from '@sentre/senhub'

import { Col, Empty, Row, Space, Table, Typography } from 'antd'
import ExpandCard from 'components/listHistory/expandCard'
import RowSpaceBetween from 'components/rowSpaceBetween'
import { MintAvatar, MintSymbol } from '@sen-use/app'
import ColumnTotal from '../historyColumns/columnTotal'
import ActionButton from '../historyColumns/actionButton'
import UnlockDateColumn from '../historyColumns/unlockDateColumn'

import { ItemSent } from 'hooks/useSentList'
import { HISTORY_COLUMNS } from 'components/historyColumns'

type SentHistoriesMobileProps = { sentList: ItemSent[] }
const SentHistoriesMobile = ({ sentList }: SentHistoriesMobileProps) => {
  if (!sentList.length) return <Empty />

  return (
    <Fragment>
      {sentList.map((itemSent, idx) => {
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
            cardId={`card_airdrop_${distributorAddress}`}
            cardHeader={
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Row align="middle" gutter={[24, 24]}>
                    <Col flex="auto">
                      <Space>
                        <MintAvatar mintAddress={mintAddress} />
                        <Space size={6}>
                          <ColumnTotal
                            total={total.toString()}
                            mintAddress={mintAddress}
                          />
                          <MintSymbol mintAddress={mintAddress} />
                        </Space>
                      </Space>
                    </Col>
                    <Col>
                      <ActionButton
                        remaining={remaining}
                        distributorAddress={distributorAddress}
                      />
                    </Col>
                  </Row>
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
      })}
    </Fragment>
  )
}

type SentHistoriesProps = { sentList: ItemSent[] }
const SentHistories = ({ sentList }: SentHistoriesProps) => {
  const infix = useInfix()
  const isMobile = infix < Infix.md

  if (isMobile) return <SentHistoriesMobile sentList={sentList} />

  return (
    <Table
      dataSource={sentList}
      pagination={false}
      columns={HISTORY_COLUMNS}
      rowKey={(record) => record.distributorAddress}
    />
  )
}

export default SentHistories
