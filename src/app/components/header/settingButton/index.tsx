import { useDispatch } from 'react-redux'

import { Button, Col, Popover, Row, Space, Switch, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import DecimalsSwitch from './decimalsSwitch'

import { AppDispatch } from 'app/model'
import { setEncryption } from 'app/model/setting.controller'

const Content = () => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Space size={24}>
          <DecimalsSwitch />
          <Typography.Text>Decimals</Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Space size={24}>
          <Switch
            disabled
            onChange={(checked: boolean) => dispatch(setEncryption(checked))}
          />
          <Typography.Text>Encrypt confidential information</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

const SettingButton = () => {
  return (
    <Popover
      trigger="click"
      placement="bottom"
      title={null}
      content={<Content />}
    >
      <Button type="text" icon={<IonIcon name="cog-outline" />} />
    </Popover>
  )
}

export default SettingButton