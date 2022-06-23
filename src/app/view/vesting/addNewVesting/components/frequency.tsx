import { Col, Row, Select, Typography } from 'antd'

export enum FREQUENCY {
  seven = 7,
  fourteen = 14,
  thirty = 30,
}

const DISTRIBUTION_FREQUENCY = [
  { label: '7 days', value: FREQUENCY.seven },
  { label: '14 days', value: FREQUENCY.fourteen },
  { label: '30 days', value: FREQUENCY.thirty },
]

type FrequencyProps = {
  frequency: FREQUENCY
  onChange: (value: number) => void
}

const Frequency = ({ frequency, onChange }: FrequencyProps) => {
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
          onChange={onChange}
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
