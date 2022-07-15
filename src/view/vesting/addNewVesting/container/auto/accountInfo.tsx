import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { util } from '@sentre/senhub'

import moment from 'moment'

import { Col, Row, Space, Typography, Tooltip, Checkbox, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import EditTimeAndAmount from './action/editTimeAndAmount'

import { AppDispatch, AppState } from 'model'
import { removeRecipient } from 'model/recipients.controller'
import { VestingItem } from 'hooks/vesting/useFilteredVestingRecipients'
import { FORMAT_DATE } from '../../../../../constants'

type AccountInfoProps = {
  vestingItem: VestingItem
  selected?: boolean
  index: number
  onChecked?: (checked: boolean, walletAddress: string) => void
}

const AccountInfo = ({
  vestingItem,
  selected = false,
  onChecked = () => {},
  index,
}: AccountInfoProps) => {
  const [visible, setVisible] = useState(false)
  const selectedFile = useSelector((state: AppState) => state.file.selectedFile)
  const decimal = useSelector((state: AppState) => state.setting.decimal)
  const expirationTime = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )

  const dispatch = useDispatch<AppDispatch>()
  const isValidAddress = !account.isAddress(vestingItem.address)

  const validateAmount = useMemo(() => {
    for (const { amount } of vestingItem.config) {
      if (!decimal && Number(amount) % 1 !== 0) return true
    }
    return false
  }, [decimal, vestingItem.config])

  return (
    <Row
      onClick={() => setVisible(true)}
      gutter={[16, 8]}
      align="middle"
      wrap={false}
      className="vesting-item"
    >
      <Col span={2}>
        <Space>
          {selected && (
            <Checkbox
              checked={selectedFile?.includes(vestingItem.address)}
              onChange={(e) => onChecked(e.target.checked, vestingItem.address)}
              className="lightning-checkbox"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <Typography.Text type="secondary">#{index + 1}</Typography.Text>
        </Space>
      </Col>
      <Col span={4}>
        <Tooltip title={vestingItem.address}>
          <Typography.Text style={{ color: isValidAddress ? '#F9575E' : '' }}>
            {util.shortenAddress(vestingItem.address)}
          </Typography.Text>
        </Tooltip>
      </Col>
      <Col span={16} className={validateAmount ? 'recipient-input-error' : ''}>
        <Row gutter={[16, 8]}>
          {vestingItem.config.map(({ amount, unlockTime }, index) => {
            const invalidTime = unlockTime > expirationTime && expirationTime
            return (
              <Col
                key={index}
                className={
                  invalidTime ? 'vesting-config-error' : 'vesting-config'
                }
              >
                <Typography.Text className="caption">
                  {amount} / {moment(unlockTime).format(FORMAT_DATE)}
                </Typography.Text>
              </Col>
            )
          })}
        </Row>
      </Col>
      <Col span={2} className="vesting-action">
        <Button
          onClick={() => dispatch(removeRecipient(vestingItem.address))}
          icon={<IonIcon name="trash-outline" />}
          type="text"
        />
      </Col>
      <EditTimeAndAmount
        setVisible={setVisible}
        visible={visible}
        walletAddress={vestingItem.address}
      />
    </Row>
  )
}

export default AccountInfo
