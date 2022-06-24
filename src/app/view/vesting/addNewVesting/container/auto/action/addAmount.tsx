import { Fragment, useState } from 'react'

import { Button, Col, DatePicker, Input, Modal, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import OverViewRecipient from './overViewRecipient'

const AddAmount = ({ walletAddress }: { walletAddress: string }) => {
  const [visible, setVisible] = useState(false)

  return (
    <Fragment>
      <Button
        onClick={() => setVisible(true)}
        icon={<IonIcon name="create-outline" />}
        type="text"
      />
      <Modal
        footer={null}
        className="card-lightning"
        style={{ paddingBottom: 0 }}
        closeIcon={<IonIcon name="close-outline" />}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Row gutter={[32, 32]}>
          <Col span={24}>
            <Typography.Title level={4}>
              Add amount & unlock time
            </Typography.Title>
          </Col>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Input />
              </Col>
              <Col span={12}>
                <DatePicker
                  placeholder="Select unlock time"
                  suffixIcon={<IonIcon name="time-outline" />}
                  className="date-option"
                  // onChange={(date) => onChange(date?.valueOf() || 0)}
                  clearIcon={null}
                  showTime
                  placement="bottomRight"
                />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Button
              icon={<IonIcon name="add-outline" />}
              size="large"
              type="dashed"
            >
              Add more
            </Button>
          </Col>
          <Col span={24}>
            <OverViewRecipient walletAddress={walletAddress} />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default AddAmount
