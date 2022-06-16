import { useDispatch, useSelector } from 'react-redux'

import { Col, Row, Select, Typography } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import { setFrequency } from 'app/model/vesting.controller'

export enum FREQUENCY {
  seven = 7,
  fourteen = 14,
  thirty = 30,
  sixty = 60,
  ninety = 90,
}

const DISTRIBUTION_FREQUENCY = [
  { label: '7 days', value: FREQUENCY.seven },
  { label: '14 days', value: FREQUENCY.fourteen },
  { label: '30 days', value: FREQUENCY.thirty },
  { label: '60 days', value: FREQUENCY.sixty },
  { label: '90 days', value: FREQUENCY.ninety },
]

const Frequency = () => {
  const frequency = useSelector((state: AppState) => state.vesting.frequency)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text className="caption">
          Distribution frequency
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Select
          className="select-vesting-data"
          value={frequency}
          onChange={(value) => dispatch(setFrequency(value))}
          placement="bottomRight"
        >
          {DISTRIBUTION_FREQUENCY.map(({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  )
}

export default Frequency
