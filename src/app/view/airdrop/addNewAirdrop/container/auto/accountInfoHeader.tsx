import { useSelector } from 'react-redux'

import { Checkbox, Col, Row, Space, Typography } from 'antd'

import { AppState } from 'app/model'

type AccountInfoHeaderProps = {
  selected?: boolean
  onChecked?: (checked: boolean) => void
}

const AccountInfoHeader = ({
  selected = false,
  onChecked = () => {},
}: AccountInfoHeaderProps) => {
  const {
    recipients2: { errorData },
  } = useSelector((state: AppState) => state)

  return (
    <Row gutter={[16, 8]} align="middle" wrap={false} justify="space-between">
      <Col span={3}>
        <Space>
          {selected && (
            <Checkbox
              className="lightning-checkbox"
              onChange={(e) => onChecked(e.target.checked)}
            />
          )}
          <Typography.Text type="secondary">No.</Typography.Text>
        </Space>
      </Col>
      <Col span={12}>
        <Typography.Text type="secondary">Wallet address</Typography.Text>
      </Col>
      <Col span={6}>
        <Typography.Text type="secondary">Amount</Typography.Text>
      </Col>
      {!!errorData.length && <Col span={3} />}
    </Row>
  )
}

export default AccountInfoHeader
