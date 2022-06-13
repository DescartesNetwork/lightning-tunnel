import { useSelector } from 'react-redux'
import { ReactNode } from 'react'

import { Card, Col, Row, Space, Typography } from 'antd'
import { MintSymbol } from 'shared/antd/mint'

import { AppState } from 'app/model'
import useTotal from 'app/hooks/useTotal'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import { numeric } from 'shared/util'
import useRemainingBalance from 'app/hooks/useRemainingBalance'

const Content = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <Row gutter={[4, 4]}>
      <Col span={24}>
        <Typography.Text type="secondary">{label}</Typography.Text>
      </Col>
      <Col span={24}>{value}</Col>
    </Row>
  )
}

export const WrapTotal = () => {
  const {
    main: { mintSelected },
  } = useSelector((sate: AppState) => sate)
  const { total, quantity } = useTotal()
  const { balance } = useAccountBalanceByMintAddress(mintSelected)
  const remainingBalance = useRemainingBalance(mintSelected)

  return (
    <Row gutter={[8, 8]}>
      <Col xs={12} md={4}>
        <Content
          label="Quantity"
          value={<Typography.Text>{quantity}</Typography.Text>}
        />
      </Col>
      <Col xs={12} md={4}>
        <Content
          label="Total"
          value={
            <Space size={4}>
              <Typography.Title level={5}>{total}</Typography.Title>
              <Typography.Title level={5}>
                <MintSymbol mintAddress={mintSelected} />
              </Typography.Title>
            </Space>
          }
        />
      </Col>
      <Col xs={12} md={4}>
        <Content
          label="Your balance"
          value={
            <Space size={4}>
              <Typography.Text>
                {numeric(balance).format('0,0.00[0000]')}
              </Typography.Text>
              <Typography.Text>
                <MintSymbol mintAddress={mintSelected} />
              </Typography.Text>
            </Space>
          }
        />
      </Col>
      <Col xs={12} md={4}>
        <Content
          label="Remaining"
          value={
            <Space size={4}>
              <Typography.Text>
                {numeric(remainingBalance).format('0,0.00[0000]')}
              </Typography.Text>
              <Typography.Text>
                <MintSymbol mintAddress={mintSelected} />
              </Typography.Text>
            </Space>
          }
        />
      </Col>
    </Row>
  )
}

const CardTotal = () => {
  return (
    <Card
      bordered={false}
      style={{ borderRadius: 8, boxShadow: 'unset' }}
      bodyStyle={{ padding: '12px 16px' }}
      className="card-total"
    >
      <WrapTotal />
    </Card>
  )
}

export default CardTotal
