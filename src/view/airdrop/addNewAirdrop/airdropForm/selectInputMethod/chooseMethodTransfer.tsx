import { Space, Typography, Radio, Row, Col } from 'antd'
import CardOption from 'components/cardOption'
import { Method } from '../../../../../constants'

export type ChooseMethodTransferProps = {
  method: Method
  onChange: (method: Method) => void
}

const ChooseMethodTransfer = ({
  method,
  onChange,
}: ChooseMethodTransferProps) => {
  return (
    <Space size={12} direction="vertical" style={{ width: '100%' }}>
      <Typography.Text>Choose transfer info input method</Typography.Text>
      <Radio.Group
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%' }}
        className="select-card"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Radio.Button value={Method.manual}>
              <CardOption
                label="Manual"
                description="Input each wallet address and airdrop amount by hand."
                active={method === Method.manual}
              />
            </Radio.Button>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Radio.Button value={Method.auto}>
              <CardOption
                label="Automatic"
                description="Upload a CSV or TXT file containing wallet addresses and airdrop amount."
                active={method === Method.auto}
              />
            </Radio.Button>
          </Col>
        </Row>
      </Radio.Group>
    </Space>
  )
}

export default ChooseMethodTransfer
