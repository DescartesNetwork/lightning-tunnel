import { Fragment, useState } from 'react'

import { Button } from 'antd'
import ModalShare from 'app/components/modalShare'

import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

export type ShareButtonProps = { cid: string }

const ShareButton = ({ cid }: ShareButtonProps) => {
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

export default ShareButton
