import { Select, SelectProps, Space } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

const TokenSelect = ({
  tokens,
}: {
  tokens: string[]
} & SelectProps) => {
  return (
    <Select>
      {tokens.map((tokenAddress) => (
        <Select.Option key={tokenAddress}>
          <Space>
            <MintAvatar mintAddress={tokenAddress} />
            <MintSymbol mintAddress={tokenAddress} />
          </Space>
        </Select.Option>
      ))}
    </Select>
  )
}

export default TokenSelect
