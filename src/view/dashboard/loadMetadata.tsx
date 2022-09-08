import { useSelector } from 'react-redux'

import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { AppState } from 'model'

const LoadMetadata = () => {
  const loadingMeta = useSelector(
    (state: AppState) => state.main.metadataLoading,
  )
  return <Spin indicator={<LoadingOutlined />} spinning={loadingMeta} />
}

export default LoadMetadata
