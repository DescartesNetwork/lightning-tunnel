import { Fragment, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@senhub/providers'

import { Button } from 'antd'
import ModalShare from 'app/components/modalShare'

import IPFS from 'shared/pdb/ipfs'
import { ClaimProof, notifyError } from 'app/helper'
import { explorer } from 'shared/util'
import { setStateHistory } from 'app/model/history.controller'
import { AppDispatch, AppState } from 'app/model'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

export type ActionButtonProps = { cid: string }

const ShareButton = ({ cid }: ActionButtonProps) => {
  const [visible, setVisible] = useState(false)
  const redeemLink = `${window.location.origin}/app/${appId}/redeem/${cid}?autoInstall=true`

  return (
    <Fragment>
      <Button
        onClick={() => setVisible(true)}
        type="text"
        style={{ color: '#42E6EB' }}
      >
        share
      </Button>
      <ModalShare
        visible={visible}
        onClose={() => setVisible(false)}
        redeemLink={redeemLink}
      />
    </Fragment>
  )
}

const ActionButton = ({ cid }: ActionButtonProps) => {
  const [loading, setLoading] = useState(false)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { history } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()

  const retry = async () => {
    const { splt, wallet } = window.sentre
    if (!wallet) throw new Error('Please connect wallet')
    setLoading(true)
    try {
      const ipfs = new IPFS()
      const claimantData = (await ipfs.get(cid)) as ClaimProof[]

      let maxTotalClaim = BigInt(0)
      let mintSelected = ''
      let distributor = ''

      Object.values(claimantData).forEach((claimProof) => {
        maxTotalClaim += BigInt(claimProof.amount)
        mintSelected = claimProof.mintAddress
        distributor = claimProof.distributorInfo.distributorATA
      })

      // Transfer token to the distributor
      const srcAddress = await splt.deriveAssociatedAddress(
        walletAddress,
        mintSelected,
      )
      const { txId } = await splt.transfer(
        BigInt(maxTotalClaim),
        srcAddress,
        distributor,
        wallet,
      )

      window.notify({
        type: 'success',
        description: 'Transfer successfully. Click to view details.',
        onClick: () => window.open(explorer(txId), '_blank'),
      })

      return dispatch(setStateHistory({ cid, state: 'DONE', walletAddress }))
    } catch (er) {
      notifyError(er)
    } finally {
      setLoading(false)
    }
  }

  const isDone = useMemo(() => {
    const currentHistory = history.find((item) => item.cid === cid)
    if (currentHistory?.state === 'DONE') return true
    return false
  }, [cid, history])

  if (isDone) return <ShareButton cid={cid} />
  return (
    <Button
      loading={loading}
      onClick={retry}
      type="text"
      style={{ color: '#42E6EB' }}
    >
      retry
    </Button>
  )
}

export default ActionButton
