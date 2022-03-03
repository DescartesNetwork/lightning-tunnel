import { Col, Popover, Row, Space, Switch } from 'antd'
import IonIcon from 'shared/antd/ionicon'

const Content = () => {
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Space size={24}>
          <Switch />
          Decimals
        </Space>
      </Col>
      <Col span={24}>
        <Space size={24}>
          <Switch />
          Encryption confidential information
        </Space>
      </Col>
    </Row>
  )
}

const Setting = () => {
  return (
    <div className="setting">
      <Popover
        trigger="click"
        placement="bottom"
        title={null}
        content={<Content />}
      >
        <IonIcon name="cog-outline" />
      </Popover>
    </div>
  )
}

export default Setting
