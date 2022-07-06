import { useUI } from '@sentre/senhub'

import { Select } from 'antd'
import RadioButtonSelect from './radioButtonSelect'

import { ALL } from '../constants'

const TIME_OPTIONS = [7, 30, 90]

type SelectTokenByTimeProps = {
  value?: string
  onChange: (val: string) => void
}
const SelectTokenByTime = ({ onChange, value }: SelectTokenByTimeProps) => {
  const {
    ui: { infix },
  } = useUI()
  const isMobile = infix === 'xs'

  if (isMobile)
    return (
      <RadioButtonSelect
        label="Filter by time"
        onSelected={onChange}
        value={TIME_OPTIONS}
        selected={value}
      />
    )

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
