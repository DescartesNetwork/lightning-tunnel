import { Fragment } from 'react'
import { useSelector } from 'react-redux'

import Loading from 'components/loading'
import DistributorWatcher from './distributor.watcher'
import ReceiptWatcher from './receipt.watcher'
import MetadatasWatcher from './metadatas.watcher'

import { AppState } from 'model'

export const AppWatcher: React.FC = ({ children }) => {
  const { distributors, metadatas } = useSelector((state: AppState) => state)
  const isLoading =
    !Object.keys(distributors).length || !Object.keys(metadatas).length

  return (
    <Fragment>
      <DistributorWatcher />
      <ReceiptWatcher />
      <MetadatasWatcher />
      {isLoading ? <Loading /> : children}
    </Fragment>
  )
}
