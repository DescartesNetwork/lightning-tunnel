import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import Loading from 'components/loading'
import DistributorWatcher from './distributor.watcher'
import ReceiptWatcher from './receipt.watcher'
import MetadatasWatcher from './metadatas.watcher'

import { AppState } from 'model'

export const AppWatcher: React.FC = ({ children }) => {
  const { distributors, metadatas } = useSelector((state: AppState) => state)
  const isLoading = isEmpty(distributors) || isEmpty(metadatas)

  return (
    <Fragment>
      <DistributorWatcher />
      <ReceiptWatcher />
      <MetadatasWatcher />
      {isLoading ? <Loading /> : children}
    </Fragment>
  )
}
