import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { account } from '@senswap/sen-js'
import moment from 'moment'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Row, Space, Typography } from 'antd'

import { AppState } from 'app/model'

const Content = ({ label, value }: { label: string; value: string }) => (
  <Space size={4}>
    <Typography.Text className="caption" type="secondary">
      {label}
    </Typography.Text>
    <Typography.Text>{value}</Typography.Text>
  </Space>
)

type DistributionConfigDetailProps = {
  walletAddress?: string
  setIsEdit: (value: boolean) => void
}

const DistributionConfigDetail = ({
  walletAddress = '',
  setIsEdit,
}: DistributionConfigDetailProps) => {
  const globalConfigs = useSelector(
    (state: AppState) => state.recipients.globalConfigs,
  )
  const globalUnlockTime = useSelector(
    (state: AppState) => state.recipients.globalUnlockTime,
  )
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )

  const unlockTime = useMemo(() => {
    if (!account.isAddress(walletAddress)) return globalUnlockTime
    return recipientInfos[walletAddress][0].unlockTime
  }, [globalUnlockTime, recipientInfos, walletAddress])

  const configs = useMemo(() => {
    if (!account.isAddress(walletAddress)) return globalConfigs
    const itemConfig = recipientInfos[walletAddress][0].configs
    if (!itemConfig) return globalConfigs
    return itemConfig
  }, [globalConfigs, recipientInfos, walletAddress])

  const isVisible = account.isAddress(walletAddress)

  return (
    <Row gutter={[32, 32]} align="middle">
      <Col>
        <Content
          label="Unlock time:"
          value={moment(unlockTime).format('DD-MM-YYYY HH:mm')}
        />
      </Col>
      <Col>
        <Content
          label="Distribution frequency:"
          value={`${configs.frequency} days`}
        />
      </Col>
      <Col>
        <Content
          label="Distribute in:"
          value={`${configs.distributeIn} months`}
        />
      </Col>
      {isVisible && (
        <Col>
          <Button
            onClick={() => setIsEdit(true)}
            type="text"
            icon={<IonIcon name="create-outline" />}
          />
        </Col>
      )}
    </Row>
  )
}

export default DistributionConfigDetail
