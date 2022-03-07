import { Col, Popover, Row, Space, Switch } from 'antd'
import { useDispatch } from 'react-redux'

import IonIcon from 'shared/antd/ionicon'

import { AppDispatch } from 'app/model'
import { setDecimal, setEncryption } from 'app/model/setting.controller'

const Content = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Space size={24}>
          <Switch
            onChange={(checked: boolean) => dispatch(setDecimal(checked))}
          />
          Decimals
        </Space>
      </Col>
      <Col span={24}>
        <Space size={24}>
          <Switch
            onChange={(checked: boolean) => dispatch(setEncryption(checked))}
          />
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
