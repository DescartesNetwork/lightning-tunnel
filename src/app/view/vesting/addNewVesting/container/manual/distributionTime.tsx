import { useSelector } from 'react-redux'
import moment from 'moment'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Row, Typography } from 'antd'

import { AppState } from 'app/model'
import { useMemo } from 'react'
import { account } from '@senswap/sen-js'

const Content = ({ label, value }: { label: string; value: string }) => (
  <Row gutter={[8, 8]}>
    <Col span={24}>
      <Typography.Text type="secondary" className="caption">
        {label}
      </Typography.Text>
    </Col>
    <Col span={24}>
      <Typography.Text>{value}</Typography.Text>
    </Col>
  </Row>
)

type DistributionTimeProps = {
  walletAddress?: string
}

const DistributionTime = ({ walletAddress = '' }: DistributionTimeProps) => {
  const globalConfigs = useSelector(
    (state: AppState) => state.recipients2.globalConfigs,
  )
  const globalUnlockTime = useSelector(
    (state: AppState) => state.recipients2.globalUnlockTime,
  )
  const recipients = useSelector(
    (state: AppState) => state.recipients2.recipients,
  )

  const unlockTime = useMemo(() => {
    if (!account.isAddress(walletAddress)) return globalUnlockTime
    return recipients[walletAddress][0].unlockTime
  }, [globalUnlockTime, recipients, walletAddress])

  const configs = useMemo(() => {
    if (!account.isAddress(walletAddress)) return globalConfigs
    const itemConfig = recipients[walletAddress][0].configs
    if (!itemConfig) return globalConfigs
    return itemConfig
  }, [globalConfigs, recipients, walletAddress])

  return (
    <Row gutter={[32, 32]}>
      <Col>
        <Content
          label="Unlock time"
          value={moment(unlockTime).format('DD-MM-YYYY HH:mm')}
        />
      </Col>
      <Col>
        <Content
          label="Distribution frequency"
          value={`${configs.frequency} days`}
        />
      </Col>
      <Col>
        <Content
          label="Distribute in"
          value={`${configs.distributeIn} months`}
        />
      </Col>
      <Col>
        <Button type="text" icon={<IonIcon name="create-outline" />} />
      </Col>
    </Row>
  )
}

export default DistributionTime
