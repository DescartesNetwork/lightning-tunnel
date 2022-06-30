import { Checkbox, Col, Row, Space, Typography } from 'antd'

type AccountInfoHeaderProps = {
  selected?: boolean
  onChecked?: (checked: boolean) => void
}

const AccountInfoHeader = ({
  selected = false,
  onChecked = () => {},
}: AccountInfoHeaderProps) => {
  return (
    <Row gutter={[16, 8]} align="middle" wrap={false} style={{ padding: 8 }}>
      <Col span={2}>
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
      <Col span={5}>
        <Typography.Text type="secondary">Wallet address</Typography.Text>
      </Col>
      <Col span={12}>
        <Typography.Text type="secondary">Amount & Unlock time</Typography.Text>
      </Col>
      <Col span={5} />
    </Row>
  )
}

export default AccountInfoHeader
