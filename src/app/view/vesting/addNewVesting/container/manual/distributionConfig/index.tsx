import DistributionConfigDetail from './distributionConfigDetail'
import EditDistributionConfig from './editDistributionConfig'

type DistributionConfigProps = {
  walletAddress?: string
  isEdit: boolean
  setIsEdit: (value: boolean) => void
}

const DistributionConfig = ({
  walletAddress = '',
  isEdit,
  setIsEdit,
}: DistributionConfigProps) => {
  return !isEdit ? (
    <DistributionConfigDetail
      setIsEdit={setIsEdit}
      walletAddress={walletAddress}
    />
  ) : (
    <EditDistributionConfig
      setIsEdit={setIsEdit}
      walletAddress={walletAddress}
    />
  )
}

export default DistributionConfig
