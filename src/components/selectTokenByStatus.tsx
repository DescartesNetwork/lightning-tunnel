import { useUI } from '@sentre/senhub'

import { Select } from 'antd'
import RadioButtonSelect from './radioButtonSelect'

import { ALL, State } from '../constants'

const STATUS_OPTIONS = [
  State.ready,
  State.waiting,
  State.claimed,
  State.expired,
]

type SelectTokenByStatusProps = {
  onChange: (val: string) => void
  value?: string
}
const SelectTokenByStatus = ({
  onChange,
  value = ALL,
}: SelectTokenByStatusProps) => {
  const {
    ui: { infix },
  } = useUI()
  const isMobile = infix === 'xs'

  if (isMobile)
    return (
      <RadioButtonSelect
        label="Filter by status"
        onSelected={onChange}
        value={STATUS_OPTIONS}
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
      <Select.Option value={ALL}>All status</Select.Option>
      {STATUS_OPTIONS.map((status, idx) => (
        <Select.Option value={status} key={idx}>
          {status}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectTokenByStatus
