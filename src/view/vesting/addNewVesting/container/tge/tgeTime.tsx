import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { Col, DatePicker, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppDispatch, AppState } from 'model'
import { setTGETime } from 'model/main.controller'
import { FORMAT_DATE } from '../../../../../constants'

const TgeTime = () => {
  const TGETime = useSelector((state: AppState) => state.main.TGETime)
  const expiration = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )

  const dispatch = useDispatch<AppDispatch>()

  const onTgeTimeChange = (time: number) => {
    return dispatch(setTGETime(time))
  }

  const error = useMemo(() => {
    if (expiration && TGETime > expiration)
      return 'Must be less than the expiration time.'
    return ''
  }, [TGETime, expiration])

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text className="caption">TGE Time</Typography.Text>
      </Col>
      <Col span={24}>
        <DatePicker
          placeholder="Select time"
          suffixIcon={<IonIcon name="time-outline" />}
          className="date-option"
          onChange={(date) => onTgeTimeChange(date?.valueOf() || 0)}
          clearIcon={null}
          value={TGETime ? moment(TGETime) : null}
          showTime={{ showSecond: false }}
          placement="bottomRight"
          format={FORMAT_DATE}
        />
      </Col>
      {error && (
        <Col span={24}>
          <Typography.Text className="caption" style={{ color: '#F9575E' }}>
            {error}
          </Typography.Text>
        </Col>
      )}
    </Row>
  )
}

export default TgeTime
