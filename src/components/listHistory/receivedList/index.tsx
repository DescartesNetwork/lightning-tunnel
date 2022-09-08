import { useInfix, Infix } from '@sentre/senhub'

import { Col, Empty, Row, Table } from 'antd'
import AirdropMobileCard from './airdropMobileCard'
import VestingMobileCard from './vestingMobileCard'

import { ReceiveItem } from 'hooks/useReceivedList'
import { TypeDistribute } from 'model/main.controller'
import { COLUMNS_RECEIVE } from 'view/dashboard/columns'

type ReceivedListProps = { receivedList: ReceiveItem[]; type: TypeDistribute }
const ReceivedList = ({ receivedList, type }: ReceivedListProps) => {
  const infix = useInfix()
  const isMobile = infix < Infix.md

  if (!isMobile)
    return (
      <Table
        dataSource={receivedList}
        pagination={false}
        columns={COLUMNS_RECEIVE}
        rowKey={(record) => record.distributorAddress + record.index}
      />
    )

  if (!receivedList.length) return <Empty />

  return (
    <Row gutter={[16, 16]}>
      {receivedList.map((receiveItem) => (
        <Col key={receiveItem.distributorAddress + receiveItem.index} span={24}>
          {type === TypeDistribute.Airdrop ? (
            <AirdropMobileCard receiveItem={receiveItem} />
          ) : (
            <VestingMobileCard receiveItem={receiveItem} />
          )}
        </Col>
      ))}
    </Row>
  )
}

export default ReceivedList
