import { Select, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

const DEFAULT_VALUE = 'Select'

const SelectToken = ({
  tokens,
  activeMintAddress,
  onSelect,
}: {
  tokens: string[]
  activeMintAddress: string
  onSelect: (mintAddress: string) => void
}) => {
  return (
    <Select
      onChange={onSelect}
      value={activeMintAddress || DEFAULT_VALUE}
      className="select-token"
    >
      <Select.Option value={DEFAULT_VALUE}>
        <Space>
          <IonIcon style={{ fontSize: 25 }} name="help-outline" />
          <Typography.Text style={{ fontSize: 16 }}>
            Select a token
          </Typography.Text>
        </Space>
      </Select.Option>
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

export default SelectToken
