import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import IonIcon from '@sentre/antd-ionicon'
import { Col, DatePicker, Row, Typography } from 'antd'

import { AppState } from 'model'

type UnlockTimeProps = {
  unlockTime: number
  onChange: (value: number) => void
}

const UnlockTime = ({ unlockTime, onChange }: UnlockTimeProps) => {
  const expirationTime = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  const error = useMemo(() => {
    if (expirationTime < unlockTime && expirationTime)
      return 'Must be less than the expiration time.'
    return ''
  }, [expirationTime, unlockTime])

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
          showTime={{ showSecond: false }}
          placement="bottomRight"
        />
      </Col>
      {error && (
        <Col span={24}>
          <Typography.Text style={{ color: '#F9575E' }} className="caption">
            {error}
          </Typography.Text>
        </Col>
      )}
    </Row>
  )
}

export default UnlockTime
