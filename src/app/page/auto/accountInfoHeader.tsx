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
    <Row gutter={[16, 8]} align="middle" wrap={false}>
      <Col style={{ minWidth: 60 }}>
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
      <Col style={{ minWidth: 296 }}>
        <Typography.Text type="secondary">Wallet address</Typography.Text>
      </Col>
      <Col style={{ minWidth: 100 }}>
        <Typography.Text type="secondary">Amount</Typography.Text>
      </Col>
      {!!errorDatas?.length && <Col style={{ minWidth: 70 }} />}
    </Row>
  )
}

export default AccountInfoHeader
