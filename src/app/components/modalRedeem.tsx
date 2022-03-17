import { useDispatch } from 'react-redux'

import { Button, Col, Modal, Row, Image, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { setVisible } from 'app/model/main.controller'
import { AppDispatch } from 'app/model'

import GIFT from 'app/static/images/gift.svg'

const ModalRedeem = ({ visible }: { visible: boolean }) => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Modal
      visible={visible}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={() => dispatch(setVisible(false))}
      footer={null}
    >
      <Row gutter={[32, 32]} style={{ textAlign: 'center' }}>
        <Col span={24}>
          <Image src={GIFT} preview={false} />
        </Col>
        <Col span={24}>
          <Space direction="vertical" size={4}>
            <Typography.Title level={3}>Successfully!</Typography.Title>
            <Space size={4}>
              <Typography.Text type="secondary">Let's take</Typography.Text>
              <Typography.Title level={5} style={{ color: '#F9575E' }}>
                1000 SNTR
              </Typography.Title>
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={() => alert('Có cái nịt mà redeem')}>
            Redeem
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalRedeem
