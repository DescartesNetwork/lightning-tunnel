import { useDispatch, useSelector } from 'react-redux'

import IonIcon from '@sentre/antd-ionicon'
import { Col, InputNumber, Row, Space, Tooltip, Typography } from 'antd'

import { AppDispatch, AppState } from 'model'
import { setTGE } from 'model/main.controller'

const TgePercent = () => {
  const TGE = useSelector((state: AppState) => state.main.TGE)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Space align="baseline" style={{ display: 'inline-flex' }}>
          <Typography.Text className="caption">
            TGE Percentage (Optional)
          </Typography.Text>
          <Tooltip title="Percent of token allocation for the first time. You can leave it blank and the value will be automatically calculated as 0%.">
            <IonIcon name="information-circle-outline" />
          </Tooltip>
        </Space>
      </Col>
      <Col span={24}>
        <InputNumber
          onChange={(TGE) => dispatch(setTGE(TGE))}
          value={TGE}
          className="TGE-input"
          placeholder="Input %"
          type="number"
          max="100"
          min="0"
        />
      </Col>
    </Row>
  )
}

export default TgePercent
