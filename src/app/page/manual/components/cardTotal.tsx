import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Card, Col, Row, Space, Typography } from 'antd'
import { MintSymbol } from 'shared/antd/mint'

import { AppState } from 'app/model'

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
  const {
    recipients: { recipients },
    main: { mintSelected },
  } = useSelector((sate: AppState) => sate)

  const listRecipients = useMemo(
    () => Object.values(recipients).map((recipient) => recipient),
    [recipients],
  )

  const total = useMemo(() => {
    let sum = 0
    for (const recipient of listRecipients) {
      sum += Number(recipient.amount)
    }
    return sum
  }, [listRecipients])

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 8, boxShadow: 'unset' }}
      bodyStyle={{ padding: '12px 16px' }}
      className="card-total"
    >
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Content label="Quantity" value={listRecipients.length} />
        </Col>
        <Col span={24}>
          <Content label="Total" value={total} mintAddress={mintSelected} />
        </Col>
      </Row>
    </Card>
  )
}

export default CardTotal
