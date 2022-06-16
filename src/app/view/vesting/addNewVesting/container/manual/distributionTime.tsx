import { useSelector } from 'react-redux'
import moment from 'moment'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Row, Typography } from 'antd'

import { AppState } from 'app/model'

const Content = ({ label, value }: { label: string; value: string }) => (
  <Row gutter={[8, 8]}>
    <Col span={24}>
      <Typography.Text type="secondary" className="caption">
        {label}
      </Typography.Text>
    </Col>
    <Col span={24}>
      <Typography.Text>{value}</Typography.Text>
    </Col>
  </Row>
)

const DistributionTime = () => {
  const { distributeIn, frequency, unlockTime } = useSelector(
    (state: AppState) => state.vesting,
  )
  return (
    <Row gutter={[32, 32]}>
      <Col>
        <Content
          label="Unlock time"
          value={moment(unlockTime).format('DD-MM-YYYY HH:mm')}
        />
      </Col>

      <Col>
        <Content label="Distribution frequency" value={`${frequency} days`} />
      </Col>
      <Col>
        <Content label="Distribute in" value={`${distributeIn} months`} />
      </Col>
      <Col>
        <Button type="text" icon={<IonIcon name="create-outline" />} />
      </Col>
    </Row>
  )
}

export default DistributionTime
