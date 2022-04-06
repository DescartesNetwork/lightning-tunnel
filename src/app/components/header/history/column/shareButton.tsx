import { Fragment, useState } from 'react'

import { Button } from 'antd'
import ModalShare from 'app/components/modalShare'

import { useAppRouter } from 'app/hooks/useAppRoute'

const ShareButton = ({ cid }: { cid: string }) => {
  const { appRoute } = useAppRouter()

  const [visible, setVisible] = useState(false)
  const redeemLink = `${window.location.origin}${appRoute}/redeem/${cid}`
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
        setVisible={setVisible}
        redeemLink={redeemLink}
      />
    </Fragment>
  )
}

export default ShareButton
