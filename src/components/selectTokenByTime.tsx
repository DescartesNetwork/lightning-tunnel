import { Select } from 'antd'

import { ALL } from '../constants'

const TIME_OPTIONS = [7, 30, 90]

type SelectTokenByTimeProps = {
  onChange: (val: string) => void
}
const SelectTokenByTime = ({ onChange }: SelectTokenByTimeProps) => {
  return (
    <Select
      className="select-existed-token"
      style={{ minWidth: 150 }}
      defaultValue={ALL}
      onChange={onChange}
      size="large"
    >
      <Select.Option value={ALL}>All time</Select.Option>
      {TIME_OPTIONS.map((time, idx) => (
        <Select.Option value={time} key={idx}>
          Past {time} days
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectTokenByTime
