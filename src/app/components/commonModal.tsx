import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

export type CommonModalProps = {
  visible: boolean
  setVisible: (visible: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  btnText: string
}

const CommonModal = ({
  visible,
  setVisible,
  title,
  description,
  onConfirm,
  onCancel,
  btnText,
}: CommonModalProps) => {
  return (
    <Modal
      visible={visible}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={() => setVisible(false)}
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
              <Typography.Text>{title}</Typography.Text>
              <Typography.Text type="secondary">{description}</Typography.Text>
            </Space>
          </Space>
        </Col>

        <Col span={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel} type="ghost">
              cancel
            </Button>
            <Button onClick={onConfirm} type="primary">
              {btnText}
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  )
}

export default CommonModal
