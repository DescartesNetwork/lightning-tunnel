import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import IonIcon from '@sentre/antd-ionicon'
import { Col, DatePicker, Row, Typography } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import { setGlobalUnlockTime } from 'app/model/recipientsV2.controller'

const UnlockTime = () => {
  const unlockTime = useSelector(
    (state: AppState) => state.recipients2.globalUnlockTime,
  )
  const dispatch = useDispatch<AppDispatch>()
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
          onChange={(date) =>
            dispatch(setGlobalUnlockTime(date?.valueOf() || 0))
          }
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
