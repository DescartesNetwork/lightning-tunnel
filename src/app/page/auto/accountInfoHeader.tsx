import { Checkbox, Col, Row, Space, Typography } from 'antd'

type AccountInfoHeaderProps = {
  selected?: boolean
  error?: boolean
  onChecked?: (checked: boolean) => void
}

const AccountInfoHeader = ({
  selected = false,
  error = false,
  onChecked = () => {},
}: AccountInfoHeaderProps) => {
  return (
    <Row gutter={0} align="middle" justify="space-between" wrap={false}>
      <Col style={{ minWidth: 40 }}>
        <Space>
          {selected && (
            <Checkbox onChange={(e) => onChecked(e.target.checked)} />
          )}
          <Typography.Text type="secondary">No.</Typography.Text>
        </Space>
      </Col>
      <Col style={{ minWidth: 140 }}>
        <Typography.Title level={5}>Wallet address</Typography.Title>
      </Col>
      <Col style={{ minWidth: 150 }}>
        <Typography.Title level={5}>Email</Typography.Title>
      </Col>
      <Col>
        <Typography.Title level={5}>Amount</Typography.Title>
      </Col>
      {error && <Col style={{ minWidth: 70 }} />}
    </Row>
  )
}

export default AccountInfoHeader
