import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Space } from 'antd'
import InputInfoTransfer from 'app/components/inputInfoTransfer'
import DistributionConfig from './distributionConfig'
import AddMoreRecipient from '../../components/addMoreRecipient'

import { AppState } from 'app/model'

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
  const [isEdit, setIsEdit] = useState(false)
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <InputInfoTransfer
        amount={amount}
        walletAddress={walletAddress}
        index={index}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <DistributionConfig
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        walletAddress={walletAddress}
      />
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
