import { Checkbox, Col, Row, Space, Typography } from 'antd'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'

type AccountInfoHeaderProps = {
  selected?: boolean
  onChecked?: (checked: boolean) => void
}

const AccountInfoHeader = ({
  selected = false,
  onChecked = () => {},
}: AccountInfoHeaderProps) => {
  const {
    recipients: { errorDatas },
  } = useSelector((state: AppState) => state)

  return (
    <Row gutter={8} align="middle" justify="space-between" wrap={false}>
      <Col style={{ minWidth: 60 }}>
        <Space>
          {selected && (
            <Checkbox onChange={(e) => onChecked(e.target.checked)} />
          )}
          <Typography.Text type="secondary">No.</Typography.Text>
        </Space>
      </Col>
      <Col style={{ minWidth: 150 }}>
        <Typography.Title level={5}>Wallet address</Typography.Title>
      </Col>
      <Col style={{ minWidth: 150 }}>
        <Typography.Title level={5}>Email</Typography.Title>
      </Col>
      <Col style={{ minWidth: 140 }}>
        <Typography.Title level={5}>Amount</Typography.Title>
      </Col>
      {!!errorDatas?.length && <Col style={{ minWidth: 70 }} />}
    </Row>
  )
}

export default AccountInfoHeader
