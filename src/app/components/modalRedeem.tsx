import { useDispatch } from 'react-redux'

import { Button, Card, Col, Modal, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { setVisible } from 'app/model/main.controller'
import { RootDispatch } from 'os/store'

const ModalRedeem = ({ visible }: { visible: boolean }) => {
  const dispatch = useDispatch<RootDispatch>()
  return (
    <Modal
      visible={visible}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={() => dispatch(setVisible(false))}
      footer={null}
    >
      <Card bordered={false}>
        <Row gutter={[24, 24]} justify="center">
          <Col span={24}>
            <Button
              type="primary"
              onClick={() => alert('Có cái nịt mà redeem')}
            >
              Redeem
            </Button>
          </Col>
        </Row>
      </Card>
    </Modal>
  )
}

export default ModalRedeem
