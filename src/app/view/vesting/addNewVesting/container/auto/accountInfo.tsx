import { forwardRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Col, Row, Space, Typography, Tooltip, Checkbox, Button } from 'antd'

import { shortenAddress } from 'shared/util'
import { AppDispatch, AppState } from 'app/model'
import { ValidVestingRecipient } from 'app/hooks/vesting/useValidVestingRecipient'
import moment from 'moment'
import IonIcon from '@sentre/antd-ionicon'
import { removeRecipient } from 'app/model/recipients.controller'
import AddAmount from './action/addAmount'

type AccountInfoProps = {
  vestingItem: ValidVestingRecipient
  selected?: boolean
  index: number
  onChecked?: (checked: boolean, walletAddress: string) => void
}

const AccountInfo = forwardRef(
  ({
    vestingItem,
    selected = false,
    onChecked = () => {},
    index,
  }: AccountInfoProps) => {
    const selectedFile = useSelector(
      (state: AppState) => state.file.selectedFile,
    )
    const decimal = useSelector((state: AppState) => state.setting.decimal)
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
                onChange={(e) =>
                  onChecked(e.target.checked, vestingItem.address)
                }
                className="lightning-checkbox"
              />
            )}
            <Typography.Text type="secondary">#{index + 1}</Typography.Text>
          </Space>
        </Col>
        <Col span={5}>
          <Tooltip title={vestingItem.address}>
            <Typography.Text style={{ color: isValidAddress ? '#F9575E' : '' }}>
              {shortenAddress(vestingItem.address)}
            </Typography.Text>
          </Tooltip>
        </Col>
        <Col
          span={12}
          className={validateAmount ? 'recipient-input-error' : ''}
        >
          <Space>
            {vestingItem.config.map(({ amount, unlockTime }) => (
              <Typography.Text
                className="caption vesting-config"
                key={unlockTime}
              >
                {amount} / {moment(unlockTime).format('DD-MM-YYYY HH:mm')}
              </Typography.Text>
            ))}
          </Space>
        </Col>
        <Col span={5} className="vesting-action">
          <Space>
            <Button
              onClick={() => dispatch(removeRecipient(vestingItem.address))}
              icon={<IonIcon name="trash-outline" />}
              type="text"
            />
            <AddAmount walletAddress={vestingItem.address} />
            <Button icon={<IonIcon name="add-outline" />} type="text" />
          </Space>
        </Col>
      </Row>
    )
  },
)

export default AccountInfo
