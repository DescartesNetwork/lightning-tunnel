import { useDispatch } from 'react-redux'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Row, Typography } from 'antd'
import AirdropAllocation from './airdropAllocation'
import History from './history'
import TotalAirdrop from './totalAirdrop'

import { useAppRouter } from 'app/hooks/useAppRoute'
import { setTypeDistribute } from 'app/model/main.controller'

const Airdrop = () => {
  const { pushHistory } = useAppRouter()
  const dispatch = useDispatch()

  const addNewAirdrop = () => {
    pushHistory('/airdrop/add-new')
    return dispatch(setTypeDistribute('airdrop'))
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Title level={2}>Airdrop</Typography.Title>
          </Col>
          <Col>
            <Button
              icon={<IonIcon name="add-outline" />}
              type="primary"
              size="large"
              onClick={addNewAirdrop}
            >
              ADD NEW
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col span={24} lg={12}>
            <TotalAirdrop />
          </Col>
          <Col span={24} lg={12}>
            <AirdropAllocation />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <History />
      </Col>
    </Row>
  )
}

export default Airdrop
