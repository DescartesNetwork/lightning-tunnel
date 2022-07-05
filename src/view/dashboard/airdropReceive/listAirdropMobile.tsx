import { Fragment } from 'react'
import moment from 'moment'
import { util } from '@sentre/senhub'

import { Col, Row, Space, Typography } from 'antd'
import ColumAction from '../columns/columAction'
import ColumnExpiration from '../columns/columnExpiration'
import ColumnStatus from '../columns/columnStatus'
import ColumnAmount from '../columns/columnTotal'
import ExpandCard from 'components/expandCard'
import RowBetweenNodeTitle from 'components/rowBetweenNodeTitle'
import RowSpaceBetween from 'components/rowSpaceBetween'

import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import { ReceiveItem } from 'model/listReceived.controller'

type ListAirdropMobileProps = {
  listAirdrop: ReceiveItem[]
  amountAirdrop: number
}

const ListAirdropMobile = ({
  listAirdrop,
  amountAirdrop,
}: ListAirdropMobileProps) => {
  return (
    <Fragment>
      {listAirdrop.slice(0, amountAirdrop).map((airdrop, idx) => {
        const {
          mintAddress,
          receiptAddress,
          recipientData,
          distributorAddress,
          sender,
        } = airdrop

        return (
          <ExpandCard
            style={{
              border: '1px solid transparent',
              borderImageSlice: '0 0 1 0',
              borderImageWidth: 1,
              borderImageSource:
                'linear-gradient(90deg,transparent, #4F5B5C, transparent)',
            }}
            cardId={receiptAddress}
            cardHeader={
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <RowBetweenNodeTitle
                    title={
                      <Space>
                        <MintAvatar mintAddress={mintAddress} />
                        <Space size={6}>
                          <ColumnAmount
                            amount={recipientData.amount}
                            mintAddress={mintAddress}
                          />
                          <MintSymbol mintAddress={mintAddress} />
                        </Space>
                      </Space>
                    }
                  >
                    <ColumnStatus
                      receiptAddress={receiptAddress}
                      startedAt={recipientData.startedAt.toNumber()}
                      distributorAddress={distributorAddress}
                    />
                  </RowBetweenNodeTitle>
                </Col>
                <Col span={24}>
                  <RowSpaceBetween
                    label={`Sender: ${util.shortenAddress(sender, 4)}`}
                    value={
                      <ColumAction
                        distributorAddress={distributorAddress}
                        receiptAddress={receiptAddress}
                        recipientData={recipientData}
                      />
                    }
                  />
                </Col>
              </Row>
            }
            key={idx}
          >
            <Row gutter={[4, 4]}>
              <Col flex="auto">Unlock time:</Col>
              <Col>
                <Typography.Text>
                  {recipientData.startedAt.toNumber()
                    ? moment(recipientData.startedAt.toNumber() * 1000).format(
                        'MMM DD, YYYY HH:mm',
                      )
                    : 'Immediately'}
                </Typography.Text>
              </Col>
              <Col span={24} />
              <Col flex="auto">Expiration time:</Col>
              <Col>
                <ColumnExpiration distributorAddress={distributorAddress} />
              </Col>
            </Row>
          </ExpandCard>
        )
      })}
    </Fragment>
  )
}

export default ListAirdropMobile
