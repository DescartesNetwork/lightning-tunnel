import { Col, Row, Select, Typography } from 'antd'

export enum DISTRIBUTE_IN_TIME {
  three = 3,
  six = 6,
  twelve = 12,
  eighteen = 18,
  twentyFour = 24,
}

const DISTRIBUTE_IN = [
  { label: '3 months', value: DISTRIBUTE_IN_TIME.three },
  { label: '6 months', value: DISTRIBUTE_IN_TIME.six },
  { label: '12 months', value: DISTRIBUTE_IN_TIME.twelve },
  { label: '18 months', value: DISTRIBUTE_IN_TIME.eighteen },
  { label: '24 months', value: DISTRIBUTE_IN_TIME.twentyFour },
]
type DistributeInProps = {
  distributeIn: DISTRIBUTE_IN_TIME
  onChange: (value: number) => void
}
const DistributeIn = ({ distributeIn, onChange }: DistributeInProps) => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text className="caption">Distribute in</Typography.Text>
      </Col>
      <Col span={24}>
        <Select
          className="select-vesting-data"
          value={distributeIn}
          onChange={onChange}
          placement="bottomRight"
        >
          {DISTRIBUTE_IN.map(({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  )
}

export default DistributeIn
