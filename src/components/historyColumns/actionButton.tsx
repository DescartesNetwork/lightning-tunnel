import { useState } from 'react'

import { Button, Space } from 'antd'
import ModalShare from 'components/modalShare'
import RevokeAction from './revokeAction'

import useCanRevoke from 'hooks/useCanRevoke'
import configs from 'configs'

const {
  manifest: { appId },
} = configs

type ActionButtonProps = {
  distributorAddress: string
  remaining: number
}

const ActionButton = ({ distributorAddress, remaining }: ActionButtonProps) => {
  const [visible, setVisible] = useState(false)
  const { isRevoke, disabled, setDisabled } = useCanRevoke(
    distributorAddress,
    remaining,
  )

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
        <RevokeAction
          disabled={disabled}
          setDisabled={setDisabled}
          distributorAddress={distributorAddress}
        />
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
