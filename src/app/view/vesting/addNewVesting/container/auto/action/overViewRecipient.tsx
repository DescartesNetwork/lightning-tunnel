import moment from 'moment'
import { useSelector } from 'react-redux'

import { Card, Col, Row } from 'antd'
import RowSpaceBetween from 'app/components/rowSpaceBetween'

import { AppState } from 'app/model'
import { shortenAddress } from 'shared/util'

const OverViewRecipient = ({ walletAddress }: { walletAddress: string }) => {
  const expirationTime = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  return (
    <Card>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <RowSpaceBetween
            label="Wallet Address"
            value={shortenAddress(walletAddress)}
          />
        </Col>
        <Col span={24}>
          <RowSpaceBetween
            label={walletAddress}
            value={moment(expirationTime).format('DD/MM/YY HH:mm')}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default OverViewRecipient
