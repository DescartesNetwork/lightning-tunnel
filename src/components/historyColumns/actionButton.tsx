import { useState } from 'react'
import { useUI } from '@sentre/senhub'

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
  treeData: Buffer
  remaining: number
}

const ActionButton = ({
  distributorAddress,
  treeData,
  remaining,
}: ActionButtonProps) => {
  const [visible, setVisible] = useState(false)
  const { isRevoke, disabled, setDisabled } = useCanRevoke(
    distributorAddress,
    remaining,
  )
  const {
    ui: { width },
  } = useUI()

  const isMobile = width < 768

  const redeemLink = `${window.location.origin}/app/${appId}/redeem/${distributorAddress}?autoInstall=true`

  return (
    <Space size={isMobile ? 16 : 24}>
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
          treeData={treeData}
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
