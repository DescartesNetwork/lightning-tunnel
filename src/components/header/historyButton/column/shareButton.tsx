import { Fragment, useState } from 'react'

import { Button } from 'antd'
import ModalShare from 'components/modalShare'

import configs from 'configs'

const {
  manifest: { appId },
} = configs

type ShareButtonProps = { distributorAddress: string }

const ShareButton = ({ distributorAddress }: ShareButtonProps) => {
  const [visible, setVisible] = useState(false)
  const redeemLink = `${window.location.origin}/app/${appId}/redeem/${distributorAddress}?autoInstall=true`

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
