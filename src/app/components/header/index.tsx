import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Divider, Row, Space, Typography } from 'antd'
import Setting from './setting'

import PoweredBySentre from 'app/components/poweredBySentre'
import { AppState } from 'app/model'
import { setDisabled } from 'app/model/setting.controller'

const Header = ({ label }: { label: string }) => {
  const { recipients } = useSelector((state: AppState) => state.recipients)
  const dispatch = useDispatch()

  const checkDisableDecimal = useCallback(() => {
    for (const recipient of recipients) {
      if (Number(recipient[2]) % 1 !== 0) return dispatch(setDisabled(true))
    }
    return dispatch(setDisabled(false))
  }, [dispatch, recipients])

  useEffect(() => {
    checkDisableDecimal()
  }, [checkDisableDecimal])

  return (
    <Row>
      <Col flex="auto">
        <Typography.Title level={5}>{label}</Typography.Title>
      </Col>
      <Col>
        <Space size={16}>
          <PoweredBySentre />
          <Divider
            type="vertical"
            style={{ margin: 0, borderLeft: '1px solid #D3D3D6' }}
          />
          <Setting />
        </Space>
      </Col>
    </Row>
  )
}

export default Header
