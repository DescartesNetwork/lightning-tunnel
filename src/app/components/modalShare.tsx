import { Modal, Image, Space, Typography, Row, Col, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import GIFT from 'app/static/images/gift.svg'

const ModalShare = ({
  visible,
  redeemLink,
  setVisible,
}: {
  visible: boolean
  redeemLink: string
  setVisible: (visible: boolean) => void
}) => {
  const onShare = () => {
    let url = 'http://twitter.com/intent/tweet?'

    const params: Record<string, string> = {
      url: redeemLink,
      text: 'The gifts 🎁 for the winners, please click to redeem 🎉🥳',
    }
    for (const prop in params)
      url += '&' + prop + '=' + encodeURIComponent(params[prop] || '')
    window.open(url, '_blank')
  }

  return (
    <Modal
      visible={visible}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Row gutter={[32, 32]} style={{ textAlign: 'center' }}>
        <Col span={24}>
          <Image src={GIFT} preview={false} />
        </Col>
        <Col span={24}>
          <Space direction="vertical" size={4}>
            <Typography.Title level={3}>Share on Twitter!!</Typography.Title>
            <Space size={4}>
              <Typography.Text type="secondary">
                You need to share this transaction in order for the recipient to
                get the token.
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={onShare}>
            Share now
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalShare
