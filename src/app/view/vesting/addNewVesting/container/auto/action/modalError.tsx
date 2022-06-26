import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import { ReactNode } from 'react'

type ModalErrorProps = {
  visible: boolean
  onClose: () => void
  addresses?: string[]
  description: ReactNode
}

const ModalError = ({
  visible,
  description,
  onClose,
  addresses,
}: ModalErrorProps) => {
  return (
    <Modal
      visible={visible}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={onClose}
      footer={null}
      className="card-lightning"
      style={{ paddingBottom: 0 }}
    >
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Space size={15} align="baseline">
            <IonIcon
              name="alert-circle-outline"
              style={{ color: '#FA8C16', fontSize: 18 }}
            />
            <Space size={4} direction="vertical">
              <Typography.Title level={4}>Can't import file!</Typography.Title>
              {description}
              {addresses &&
                addresses.map((address) => (
                  <Space key={address}>
                    <IonIcon
                      style={{ color: '#F9575E' }}
                      name="close-circle-outline"
                    />
                    <Typography.Text>{address}</Typography.Text>
                  </Space>
                ))}
            </Space>
          </Space>
        </Col>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button onClick={onClose} type="primary">
            try again
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalError
