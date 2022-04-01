import { useState } from 'react'

import { Tooltip, Space, Typography, Popover } from 'antd'
import QRCodeCanvas from 'qrcode.react'
import CopyToClipboard from 'react-copy-to-clipboard'

import { useRootSelector, RootState } from 'os/store'
import { explorer, shortenAddress } from 'shared/util'
import IconButton from './iconButton'

const QR = ({ address }: { address: string }) => {
  return (
    <Popover
      placement="bottomLeft"
      color="#ffffff"
      overlayInnerStyle={{ paddingTop: 6 }}
      content={
        <QRCodeCanvas
          value={address}
          size={140}
          bgColor="#ffffff"
          fgColor="#1f1f1f"
        />
      }
      trigger="click"
      arrowPointAtCenter
    >
      <IconButton name="qr-code-outline" />
    </Popover>
  )
}

const Address = () => {
  const { address } = useRootSelector((state: RootState) => state.wallet)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <Space size={10}>
      <Typography.Text
        style={{ color: '#E9E9EB', cursor: 'pointer' }}
        onClick={() => window.open(explorer(address), '_blank')}
      >
        {shortenAddress(address, 3, '...')}
      </Typography.Text>
      <Tooltip title="Copied" visible={copied}>
        <CopyToClipboard text={address} onCopy={onCopy}>
          <IconButton name="copy-outline" onClick={onCopy} />
        </CopyToClipboard>
      </Tooltip>
      <QR address={address} />
    </Space>
  )
}

export default Address
