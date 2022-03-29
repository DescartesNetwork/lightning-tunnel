import { Button, Col, Modal, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

const ModalMerge = ({
  visible,
  setVisible,
  onConfirm,
  onCancel,
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}) => {
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
              <Typography.Text>
                Do you want to merge wallet addresses?
              </Typography.Text>
              <Typography.Text type="secondary">
                There are some wallet addresses that are the same.
              </Typography.Text>
            </Space>
          </Space>
        </Col>

        <Col span={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel} type="ghost">
              cancel
            </Button>
            <Button onClick={onConfirm} type="primary">
              merge
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalMerge
