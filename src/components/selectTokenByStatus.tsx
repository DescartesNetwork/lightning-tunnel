import { Select } from 'antd'
import { State } from '../constants'

const STATUS_OPTIONS = [
  State.loading,
  State.waiting,
  State.ready,
  State.claimed,
  State.expired,
]

type SelectTokenByStatusProps = {
  onChange: (val: string) => void
}
const SelectTokenByStatus = ({ onChange }: SelectTokenByStatusProps) => {
  return (
    <Select
      className="select-existed-token"
      style={{ minWidth: 150 }}
      defaultValue="all"
      onChange={onChange}
      size="large"
    >
      <Select.Option value="all">All status</Select.Option>
      {STATUS_OPTIONS.map((status, idx) => (
        <Select.Option value={status} key={idx}>
          {status}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectTokenByStatus
