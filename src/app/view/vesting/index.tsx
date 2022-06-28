import { useDispatch } from 'react-redux'

import { Button, Col, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import History from './history'
import StatisticVesting from './statisticVesting'
import VestingAllocation from './vestingAllocation'

import { useAppRouter } from 'app/hooks/useAppRoute'
import { setTypeDistribute } from 'app/model/main.controller'

const Vesting = () => {
  const { pushHistory } = useAppRouter()
  const dispatch = useDispatch()

  const addNewVesting = () => {
    pushHistory('/vesting/add-new')
    return dispatch(setTypeDistribute('vesting'))
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Title level={2}>Vesting</Typography.Title>
          </Col>
          <Col>
            <Button
              icon={<IonIcon name="add-outline" />}
              type="primary"
              size="large"
              onClick={addNewVesting}
            >
              ADD NEW
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={24} lg={8}>
            <StatisticVesting />
          </Col>
          <Col span={24} lg={16}>
            <VestingAllocation />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <History />
      </Col>
    </Row>
  )
}

export default Vesting
