import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

import {
  Modal,
  Image,
  Space,
  Typography,
  Row,
  Col,
  Button,
  Tooltip,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { asyncWait } from 'shared/util'

import TWITTER from 'app/static/images/twitter.svg'

export type ModalShareProps = {
  visible: boolean
  redeemLink: string
  onClose?: () => void
}

const ModalShare = ({
  visible,
  redeemLink,
  onClose = () => {},
}: ModalShareProps) => {
  const [copied, setCopied] = useState(false)

  const onShare = () => {
    let url = 'http://twitter.com/intent/tweet?'

    const params: Record<string, string> = {
      url: redeemLink,
      text: 'Your prize has arrived! Redeem now at Sen Hub: ',
    }
    for (const prop in params)
      url += '&' + prop + '=' + encodeURIComponent(params[prop] || '')
    window.open(url, '_blank')
  }

  const shortenRedeemLink = (redeemLink: string) => {
    const perfectLength = 40
    const delimiter = '...'
    return redeemLink.substring(0, perfectLength) + delimiter
  }

  const onCopy = async () => {
    setCopied(true)
    await asyncWait(1500)
    setCopied(false)
  }

  return (
    <Modal
      visible={visible}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={onClose}
      footer={null}
      className="card-lightning"
      style={{ paddingBottom: 0 }}
    >
      <Row gutter={[32, 32]} style={{ textAlign: 'center' }}>
        <Col span={24}>
          <Image src={TWITTER} preview={false} />
        </Col>
        <Col span={24}>
          <Space direction="vertical" size={4}>
            <Typography.Title level={3}>Share on Twitter!</Typography.Title>
            <Space size={4}>
              <Typography.Text type="secondary">
                Share this link so your recipients can get their tokens
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <Row gutter={8} justify="space-between">
            <Col className="share-link" span={20}>
              <Typography.Text>{shortenRedeemLink(redeemLink)}</Typography.Text>
            </Col>
            <Col span={4}>
              <Tooltip title="Copied" visible={copied}>
                <CopyToClipboard text={redeemLink}>
                  <Button size="large" type="ghost" onClick={onCopy}>
                    copy
                  </Button>
                </CopyToClipboard>
              </Tooltip>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Button size="large" type="primary" block onClick={onShare}>
            Share now
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalShare
