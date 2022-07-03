import { useSelector } from 'react-redux'

import AddMoreRecipient from '../../components/addMoreRecipient'
import InputInfoTransfer from 'components/inputInfoTransfer'

import { AppState } from 'model'

type MethodInputRecipientProps = {
  walletAddress?: string
  amount?: string
  index?: number
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
      <InputInfoTransfer
        amount={amount}
        walletAddress={walletAddress}
        index={index}
      />
    )
  return <AddMoreRecipient amount={amount} walletAddress={walletAddress} />
}

export default MethodInputRecipient
