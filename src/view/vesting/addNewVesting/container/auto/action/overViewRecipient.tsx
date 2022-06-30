import moment from 'moment'
import { useSelector } from 'react-redux'
import { util } from '@sentre/senhub'

import { Card, Col, Row } from 'antd'
import RowSpaceBetween from 'components/rowSpaceBetween'

import { AppState } from 'model'

const OverviewRecipient = ({ walletAddress }: { walletAddress: string }) => {
  const expirationTime = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  return (
    <Card className="card-overview" bodyStyle={{ padding: '13px 16px' }}>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <RowSpaceBetween
            label="Wallet Address"
            value={util.shortenAddress(walletAddress)}
          />
        </Col>
        <Col span={24}>
          <RowSpaceBetween
            label="Expiration Time"
            value={
              expirationTime
                ? moment(expirationTime).format('DD/MM/YYYY HH:mm')
                : 'Unlimited'
            }
          />
        </Col>
      </Row>
    </Card>
  )
}

export default OverviewRecipient
