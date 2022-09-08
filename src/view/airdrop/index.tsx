import { useDispatch } from 'react-redux'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Row, Typography } from 'antd'
import AirdropAllocation from './airdropAllocation'
import History from './history'
import TotalAirdrop from './totalAirdrop'

import { useAppRouter } from 'hooks/useAppRoute'
import { setTypeDistribute, TypeDistribute } from 'model/main.controller'
import useAllocation from 'hooks/useAllocation'

const Airdrop = () => {
  const { pushHistory } = useAppRouter()
  const dispatch = useDispatch()
  const {
    allocation,
    totalUSD,
    numberOfRecipient,
    numberOfCampaigns,
    loading,
  } = useAllocation(TypeDistribute.Airdrop)

  const addNewAirdrop = () => {
    pushHistory('/airdrop/add-new')
    return dispatch(setTypeDistribute(TypeDistribute.Airdrop))
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
          <Col span={24} lg={8}>
            <TotalAirdrop
              valueInUSD={totalUSD}
              numberOfCampaign={numberOfCampaigns}
              recipientList={numberOfRecipient}
              loading={loading}
            />
          </Col>
          <Col span={24} lg={16}>
            <AirdropAllocation
              airdropAllocation={allocation}
              loading={loading}
            />
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
