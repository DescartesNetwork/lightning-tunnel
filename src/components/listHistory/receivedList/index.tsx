import { useWidth } from '@sentre/senhub'

import { Col, Empty, Row, Table } from 'antd'
import AirdropMobileCard from './airdropMobileCard'
import VestingMobileCard from './vestingMobileCard'

import { ReceiveItem } from 'hooks/useReceivedList'
import { TypeDistribute } from 'model/main.controller'
import { COLUMNS_RECEIVE } from 'view/dashboard/columns'

type ReceivedListProps = { receivedList: ReceiveItem[]; type: TypeDistribute }
const ReceivedList = ({ receivedList, type }: ReceivedListProps) => {
  const width = useWidth()
  const isMobile = width < 1050

  if (!isMobile && receivedList.length)
    return (
      <Table
        key={`lightning-tunnel-${type}`}
        dataSource={receivedList}
        pagination={false}
        columns={COLUMNS_RECEIVE}
        rowKey={(record) => record.distributorAddress + record.index}
        defaultExpandAllRows={true}
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
