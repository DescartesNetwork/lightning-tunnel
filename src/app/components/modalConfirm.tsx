import { ReactNode } from 'react'

import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

type ModalConfirmProps = {
  visible: boolean
  title: string
  description: ReactNode
  textButtonConfirm: string
  closeModal: (visible: false) => void
  onConfirm: () => void
}

const ModalConfirm = (props: ModalConfirmProps) => {
  const {
    visible,
    title,
    description,
    textButtonConfirm,
    closeModal,
    onConfirm,
  } = props
  return (
    <Modal
      className="modal-merge-amount"
      closable={false}
      visible={visible}
      title={null}
      footer={null}
    >
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Space size={15} align="baseline">
            <IonIcon
              style={{ color: '#FA8C16', fontSize: 18 }}
              name="alert-circle-outline"
            />
            <Space direction="vertical">
              <Typography.Title level={5}>{title}</Typography.Title>
              {description}
            </Space>
          </Space>
        </Col>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => closeModal(false)}>Cancel</Button>
            <Button onClick={onConfirm} type="primary">
              {textButtonConfirm}
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalConfirm
