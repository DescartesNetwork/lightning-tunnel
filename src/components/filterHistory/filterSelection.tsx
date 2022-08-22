import { CSSProperties } from 'react'
import { util } from '@sentre/senhub'

import { Select, Space } from 'antd'
import { MintAvatar, MintSymbol } from '@sen-use/app'

import { ALL } from '../../constants'

type FieldOptionProps = { option: string }
const FieldOption = ({ option }: FieldOptionProps) => {
  if (util.isAddress(option))
    return (
      <Space>
        <MintAvatar mintAddress={option} />
        <MintSymbol mintAddress={option} />
      </Space>
    )
  return option
}

type SelectExistMintTokenProps = {
  onChange: (val: string) => void
  style?: CSSProperties
  defaultValue?: string
  options: string[] | number[]
  value?: string
}

const FilterSelection = ({
  onChange,
  style,
  defaultValue = 'All token',
  options,
  value,
}: SelectExistMintTokenProps) => {
  return (
    <Select
      className="select-existed-token"
      style={{ minWidth: 150, width: '100%', ...style }}
      defaultValue={ALL}
      onChange={onChange}
      size="large"
      value={value}
    >
      <Select.Option value={ALL}>{defaultValue}</Select.Option>
      {options.map((option, idx) => (
        <Select.Option value={option} key={idx}>
          <FieldOption option={option.toString()} />
        </Select.Option>
      ))}
    </Select>
  )
}

export default FilterSelection
