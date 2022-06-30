import { Space } from 'antd'
import InputInfoTransfer from 'components/inputInfoTransfer'
import DistributionConfig from './distributionConfig'
import { useSelector } from 'react-redux'
import { AppState } from 'model'
import AddMoreRecipient from '../../components/addMoreRecipient'

type MethodInputRecipientProps = {
  walletAddress?: string
  amount?: string
  index?: number
}

const InputInfo = ({
  walletAddress,
  amount,
  index,
}: MethodInputRecipientProps) => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <InputInfoTransfer
        amount={amount}
        walletAddress={walletAddress}
        index={index}
      />
      <DistributionConfig walletAddress={walletAddress} />
    </Space>
  )
}

const MethodInputRecipient = ({
  walletAddress,
  amount,
  index,
}: MethodInputRecipientProps) => {
  const advanced = useSelector(
    (state: AppState) => state.advancedMode.isAdvancedMode,
  )
  if (!advanced)
    return (
      <InputInfo amount={amount} walletAddress={walletAddress} index={index} />
    )
  return <AddMoreRecipient amount={amount} walletAddress={walletAddress} />
}

export default MethodInputRecipient
