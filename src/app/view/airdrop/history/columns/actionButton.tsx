import { useState } from 'react'
import BN from 'bn.js'
import { FeeOptions } from '@sentre/utility'

import { Button, Space } from 'antd'
import ModalShare from 'app/components/modalShare'

import configs from 'app/configs'
import { notifyError, notifySuccess } from 'app/helper'
import useCanRevoke from 'app/hooks/useCanRevoke'

const {
  manifest: { appId },
  sol: { utility, fee, taxman },
} = configs

type ActionButtonProps = { distributorAddress: string }

const ActionButton = ({ distributorAddress }: ActionButtonProps) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const { disabled, isRevoke } = useCanRevoke({ distributorAddress })

  const feeOptions: FeeOptions = {
    fee: new BN(fee),
    feeCollectorAddress: taxman,
  }

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
        style={{ color: '#42E6EB', padding: 0 }}
      >
        share
      </Button>
      {isRevoke && (
        <Button
          onClick={onRevoke}
          type="text"
          loading={loading}
          disabled={disabled}
          style={{ padding: 0 }}
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
