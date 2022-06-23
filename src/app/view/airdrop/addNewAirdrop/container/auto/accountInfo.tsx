import { forwardRef, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Col, Row, Space, Typography, Tooltip, Checkbox } from 'antd'
import NumericInput from '@sentre/antd-numeric-input'

import { shortenAddress } from 'shared/util'
import { AppState } from 'app/model'

type AccountInfoProps = {
  accountAddress?: string
  selected?: boolean
  email?: string
  amount?: number | string
  index: number
  onChecked?: (checked: boolean, walletAddress: string) => void
}

const AccountInfo = forwardRef(
  (
    {
      accountAddress = '',
      amount = 0,
      selected = false,
      onChecked = () => {},
      index,
    }: AccountInfoProps,
    ref: any,
  ) => {
    const {
      file: { selectedFile },
      setting: { decimal },
    } = useSelector((state: AppState) => state)
    const amountRef = useRef(ref)

    const isValidAddress = !account.isAddress(accountAddress)

    const validateAmount = useMemo(() => {
      if (!amount) return false
      if (!decimal && Number(amount) % 1 !== 0) return true
      return false
    }, [amount, decimal])

    return (
      <Row gutter={[16, 8]} align="middle" justify="space-between" wrap={false}>
        <Col span={3}>
          <Space>
            {selected && (
              <Checkbox
                checked={selectedFile?.includes(accountAddress)}
                onChange={(e) => onChecked(e.target.checked, accountAddress)}
                className="lightning-checkbox"
              />
            )}
            <Typography.Text type="secondary">#{index + 1}</Typography.Text>
          </Space>
        </Col>
        <Col span={12}>
          <Tooltip title={accountAddress}>
            <Typography.Text style={{ color: isValidAddress ? '#F9575E' : '' }}>
              {shortenAddress(accountAddress)}
            </Typography.Text>
          </Tooltip>
        </Col>
        <Col span={6}>
          <NumericInput
            value={amount}
            bordered={false}
            disabled={true}
            style={{ padding: 0 }}
            className={
              validateAmount ? 'recipient-input-error' : 'recipient-input-auto'
            }
            ref={amountRef}
          />
        </Col>
      </Row>
    )
  },
)

export default AccountInfo
