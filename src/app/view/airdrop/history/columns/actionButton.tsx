import { useCallback, useEffect, useState } from 'react'
import BN from 'bn.js'
import { FeeOptions } from '@sentre/utility'

import { Button, Space } from 'antd'
import ModalShare from 'app/components/modalShare'

import configs from 'app/configs'
import { notifyError, notifySuccess } from 'app/helper'

const {
  manifest: { appId },
  sol: { utility, fee, taxman },
} = configs

type ActionButtonProps = { distributorAddress: string }

const CURRENT_TIME = new Date().getTime()

const ActionButton = ({ distributorAddress }: ActionButtonProps) => {
  const [visible, setVisible] = useState(false)
  const [isRevoke, setIsRevoke] = useState(false)
  const [loading, setLoading] = useState(false)
  const [disabled, setSetDisabled] = useState(false)

  const feeOptions: FeeOptions = {
    fee: new BN(fee),
    feeCollectorAddress: taxman,
  }

  const checkCanRevoke = useCallback(async () => {
    const { splt } = window.sentre
    const distributor = await utility.getDistributorData(distributorAddress)
    const { endedAt, mint } = distributor
    const endTime = endedAt.toNumber() * 1000

    const treasurerAddress = await utility.deriveTreasurerAddress(
      distributorAddress,
    )
    const associatedAddress = await splt.deriveAssociatedAddress(
      treasurerAddress,
      mint.toBase58(),
    )
    const { amount } = await splt.getAccountData(associatedAddress)

    if (Number(amount) === 0) setSetDisabled(true)
    if (!endTime) return setIsRevoke(false)
    if (endTime < CURRENT_TIME) return setIsRevoke(true)
    return setIsRevoke(false)
  }, [distributorAddress])

  useEffect(() => {
    checkCanRevoke()
  }, [checkCanRevoke])

  const onRevoke = async () => {
    if (!isRevoke) return
    setLoading(true)
    try {
      const { txId } = await utility.revoke({ distributorAddress, feeOptions })
      return notifySuccess('Revoked token', txId)
    } catch (er) {
      notifyError(er)
    } finally {
      setLoading(false)
    }
  }

  const redeemLink = `${window.location.origin}/app/${appId}/redeem/${distributorAddress}?autoInstall=true`

  return (
    <Space>
      <Button
        onClick={() => setVisible(true)}
        type="text"
        style={{ color: '#42E6EB' }}
      >
        share
      </Button>
      {isRevoke && (
        <Button
          onClick={onRevoke}
          type="text"
          loading={loading}
          disabled={disabled}
        >
          revoke
        </Button>
      )}
      <ModalShare
        visible={visible}
        onClose={() => setVisible(false)}
        redeemLink={redeemLink}
      />
    </Space>
  )
}

export default ActionButton
