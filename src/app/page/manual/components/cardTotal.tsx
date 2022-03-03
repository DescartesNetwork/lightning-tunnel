import { Card, Col, Row, Space, Typography } from 'antd'
import { MintSymbol } from 'shared/antd/mint'

const Content = ({
  label,
  value,
  mintAddress,
}: {
  label: string
  value: number
  mintAddress?: string
}) => {
  return (
    <Row>
      <Col flex="auto">
        <Typography.Text type="secondary">{label}</Typography.Text>
      </Col>
      <Col>
        {mintAddress ? (
          <Space size={4}>
            <Typography.Title level={5}>{value}</Typography.Title>
            <Typography.Title level={5}>
              <MintSymbol mintAddress={mintAddress} />
            </Typography.Title>
          </Space>
        ) : (
          <Typography.Text>{value}</Typography.Text>
        )}
      </Col>
    </Row>
  )
}

const CardTotal = () => {
  return (
    <Card
      bordered={false}
      style={{ borderRadius: 8 }}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Content label="Quantity" value={1} />
        </Col>
        <Col span={24}>
          <Content
            label="Total"
            value={1}
            mintAddress="So11111111111111111111111111111111111111112"
          />
        </Col>
      </Row>
    </Card>
  )
}

export default CardTotal
