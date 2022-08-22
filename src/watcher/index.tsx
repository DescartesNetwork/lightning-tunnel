import { Fragment, useState } from 'react'

import Loading from 'components/loading'
import DistributorWatcher from './distributor.watcher'
import ReceiptWatcher from './receipt.watcher'
import MetadatasWatcher from './metadatas.watcher'

export const AppWatcher: React.FC = ({ children }) => {
  const [distributorLoading, setDistributorLoading] = useState(true)
  const [receiptLoading, setReceiptLoading] = useState(true)
  const [metadatasLoading, setMetadatasLoading] = useState(true)

  return (
    <Fragment>
      <DistributorWatcher updateStatus={setDistributorLoading} />
      <ReceiptWatcher updateStatus={setReceiptLoading} />
      <MetadatasWatcher updateStatus={setMetadatasLoading} />
      {distributorLoading || receiptLoading || metadatasLoading ? (
        <Loading />
      ) : (
        children
      )}
    </Fragment>
  )
}
