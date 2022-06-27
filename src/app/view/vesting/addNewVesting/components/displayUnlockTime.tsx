import moment from 'moment'

import { Col, Row, Typography } from 'antd'

const DisplayUnlockTime = ({
  listUnlockTime,
}: {
  listUnlockTime: number[]
}) => {
  return (
    <Row gutter={[8, 8]} align="middle">
      <Col>
        <Typography.Text className="caption" type="secondary">
          Unlock time
        </Typography.Text>
      </Col>
      {listUnlockTime.map((unlockTime, index) => (
        <Col key={unlockTime + index} className="unlock-time-item ">
          <Typography.Text className="caption">
            {moment(unlockTime).format('DD-MM-YYYY HH:mm')}
          </Typography.Text>
        </Col>
      ))}
    </Row>
  )
}

export default DisplayUnlockTime
