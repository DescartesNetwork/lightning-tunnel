import React, { useState } from 'react'
import DistributionConfigDetail from './distributionConfigDetail'
import EditDistributionConfig from './editDistributionConfig'

type DistributionConfigProps = {
  walletAddress?: string
}

const DistributionConfig = ({
  walletAddress = '',
}: DistributionConfigProps) => {
  const [isEdit, setIsEdit] = useState(false)
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
