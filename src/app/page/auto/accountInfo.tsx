import { useSelector } from 'react-redux'

import {
  Button,
  Col,
  Row,
  Space,
  Typography,
  Tooltip,
  Divider,
  Checkbox,
} from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { shortenAddress } from 'shared/util'
import { AppState } from 'app/model'

type AccountInfoProps = {
  email?: string
  accountAddress?: string
  amount?: string
  index: number
  selected?: boolean
  onChecked?: (checked: boolean, walletAddress: string) => void
}

const AccountInfo = ({
  accountAddress = '',
  index = 0,
  selected = false,
  onChecked = () => {},
}: AccountInfoProps) => {
  const { recipients } = useSelector((state: AppState) => state.recipients)
  const { email, walletAddress, amount } = recipients[accountAddress]

  return (
    <Row gutter={[16, 8]}>
      <Col span={24}>
        <Row
          gutter={[16, 8]}
          align="middle"
          justify="space-between"
          wrap={false}
        >
          <Col>
            <Space>
              {selected && (
                <Checkbox
                  onChange={(e) => onChecked(e.target.checked, walletAddress)}
                />
              )}
              <Typography.Text type="secondary">#{index + 1}</Typography.Text>
            </Space>
          </Col>
          <Col>
            <Typography.Text>{shortenAddress(email, 8)}</Typography.Text>
          </Col>
          <Col>
            <Tooltip title={walletAddress}>
              <Typography.Text>{shortenAddress(walletAddress)}</Typography.Text>
            </Tooltip>
          </Col>
          <Col>
            <Typography.Text>{amount}</Typography.Text>
          </Col>
          <Col>
            <Space align="center">
              <IonIcon name="checkmark-outline" style={{ color: '#03A326' }} />
              <Button type="text" icon={<IonIcon name="create-outline" />} />
            </Space>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Divider style={{ margin: 0 }} />
      </Col>
    </Row>
  )
}

export default AccountInfo
