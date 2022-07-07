import { CSSProperties } from 'react'

import { Select, Space } from 'antd'

import { ALL } from '../constants'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

type SelectExistMintTokenProps = {
  mintAddresses: string[]
  onChange: (val: string) => void
  style?: CSSProperties
}
const SelectExistMintToken = ({
  mintAddresses,
  onChange,
  style,
}: SelectExistMintTokenProps) => {
  return (
    <Select
      className="select-existed-token"
      style={{ minWidth: 150, ...style }}
      defaultValue={ALL}
      onChange={onChange}
      size="large"
    >
      <Select.Option value={ALL}>All token</Select.Option>
      {mintAddresses.map((mintAddr, idx) => (
        <Select.Option value={mintAddr} key={idx}>
          <Space>
            <MintAvatar mintAddress={mintAddr} />
            <MintSymbol mintAddress={mintAddr} />
          </Space>
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectExistMintToken
