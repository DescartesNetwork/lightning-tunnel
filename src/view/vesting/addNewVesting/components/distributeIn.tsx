import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Col, Row, Select, Typography } from 'antd'

import { AppState } from 'model'
import { ONE_DAY } from '../../../../constants'

export enum DISTRIBUTE_IN_TIME {
  three = 3,
  six = 6,
  twelve = 12,
  eighteen = 18,
  twentyFour = 24,
}

const DISTRIBUTE_IN = [
  { label: '3 months', value: DISTRIBUTE_IN_TIME.three },
  { label: '6 months', value: DISTRIBUTE_IN_TIME.six },
  { label: '12 months', value: DISTRIBUTE_IN_TIME.twelve },
  { label: '18 months', value: DISTRIBUTE_IN_TIME.eighteen },
  { label: '24 months', value: DISTRIBUTE_IN_TIME.twentyFour },
]
type DistributeInProps = {
  distributeIn: DISTRIBUTE_IN_TIME
  onChange: (value: number) => void
  walletAddress?: string
}
const DistributeIn = ({
  distributeIn,
  onChange,
  walletAddress,
}: DistributeInProps) => {
  const expirationTime = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  const globalUnlockTime = useSelector(
    (state: AppState) => state.recipients.globalUnlockTime,
  )
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )

  const error = useMemo(() => {
    const unlockTime = walletAddress
      ? recipientInfos[walletAddress][0].unlockTime
      : globalUnlockTime
    const time = unlockTime + distributeIn * 30 * ONE_DAY
    if (expirationTime < time && expirationTime)
      return 'Must be less than the expiration time.'
    return ''
  }, [
    distributeIn,
    expirationTime,
    globalUnlockTime,
    recipientInfos,
    walletAddress,
  ])

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text className="caption">Distribute in</Typography.Text>
      </Col>
      <Col span={24}>
        <Select
          className="select-vesting-data"
          value={distributeIn}
          onChange={onChange}
          placement="bottomRight"
        >
          {DISTRIBUTE_IN.map(({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Col>
      {error && (
        <Col span={24}>
          <Typography.Text style={{ color: '#F9575E' }} className="caption">
            {error}
          </Typography.Text>
        </Col>
      )}
    </Row>
  )
}

export default DistributeIn
