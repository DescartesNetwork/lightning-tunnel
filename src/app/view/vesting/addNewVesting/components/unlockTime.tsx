import moment from 'moment'

import IonIcon from '@sentre/antd-ionicon'
import { Col, DatePicker, Row, Typography } from 'antd'

type UnlockTimeProps = {
  unlockTime: number
  onChange: (value: number) => void
}

const UnlockTime = ({ unlockTime, onChange }: UnlockTimeProps) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text className="caption">Unlock time</Typography.Text>
      </Col>
      <Col span={24}>
        <DatePicker
          placeholder="Select time"
          suffixIcon={<IonIcon name="time-outline" />}
          className="date-option"
          onChange={(date) => onChange(date?.valueOf() || 0)}
          clearIcon={null}
          value={unlockTime ? moment(unlockTime) : null}
          showTime
          placement="bottomRight"
        />
      </Col>
    </Row>
  )
}

export default UnlockTime
