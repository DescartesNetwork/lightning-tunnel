import { Col, Radio, Row, Typography } from 'antd'
import { ALL } from '../constants'

type RadioButtonSelectProps = {
  label: string
  value: string[] | number[]
  selected?: string
  onSelected: (selected: string) => void
}
const RadioButtonSelect = ({
  label,
  value,
  selected,
  onSelected,
}: RadioButtonSelectProps) => {
  return (
    <Row gutter={[4, 4]}>
      <Col span={24}>
        <Typography.Text type="secondary">{label}</Typography.Text>
      </Col>
      <Col span={24}>
        <Radio.Group
          onChange={(e) => onSelected(e.target.value)}
          value={selected}
          className="filter-lighning-radio-btn"
        >
          <Row gutter={[8, 8]}>
            <Col span={8}>
              <Radio.Button value={ALL}>All time</Radio.Button>
            </Col>
            {value.map((item, idx) => (
              <Col span={8} key={idx}>
                <Radio.Button value={item}>{item}</Radio.Button>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Col>
    </Row>
  )
}

export default RadioButtonSelect
