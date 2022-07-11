import { useEffect, useState } from 'react'
import { utils } from '@senswap/sen-js'
import { useWallet, util } from '@sentre/senhub'
import { numeric } from '@sentre/senhub/dist/shared/util'

import { Card, Col, Row, Space, Typography } from 'antd'
import { MintAvatar, MintName, MintSymbol } from 'shared/antd/mint'
import { ButtonOpenExplorer, Verification } from './mintCard'

import { useJupiterTokens } from './hooks/useJupiterTokens'

export const SOL_ADDRESS = '11111111111111111111111111111111'
export const SOL_DECIMALS = 9

export type SolCardProps = {
  onClick?: (mintAddress: string) => void
}
const SolCard = ({ onClick = () => {} }: SolCardProps) => {
  const [price, setPrice] = useState(0)
  const jptTokens = useJupiterTokens()
  const {
    wallet: { lamports },
  } = useWallet()

  const solBalance = utils.undecimalize(lamports, SOL_DECIMALS)

  const formatNumric = (value: string | number) =>
    numeric(value).format('0,0.[000]')

  useEffect(() => {
    ;(async () => {
      const { price } = await util.fetchCGK('solana')
      setPrice(price)
    })()
  }, [])

  return (
    <Card
      bodyStyle={{ padding: 8 }}
      style={{
        boxShadow: 'unset',
        cursor: 'pointer',
        background:
          'linear-gradient(269.1deg, rgba(0, 255, 163, 0.1) 0%, rgba(220, 31, 255, 0.1) 100%)',
        borderRadius: 8,
      }}
      bordered={false}
      onClick={() => onClick(SOL_ADDRESS)}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col>
          <MintAvatar mintAddress={SOL_ADDRESS} size={36} />
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            {/* Mint symbol */}
            <Space>
              <Typography.Text>
                <MintSymbol mintAddress={SOL_ADDRESS} />
              </Typography.Text>
              {jptTokens?.verify(SOL_ADDRESS) && <Verification />}
            </Space>
            {/* Mint name */}
            <Typography.Text type="secondary" className="caption">
              <MintName mintAddress={SOL_ADDRESS} />
              Native
            </Typography.Text>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: 'right' }}>
          <Space>
            {/* SOL infomation */}
            <Space direction="vertical">
              <Space size={4}>
                <Typography.Text style={{ color: ' #03e1ff' }}>
                  ◎
                </Typography.Text>
                <Typography.Text>{formatNumric(solBalance)}</Typography.Text>
              </Space>
              <Typography.Text type="secondary" className="caption">
                {formatNumric(price * Number(solBalance))} $
              </Typography.Text>
            </Space>
            {/*  Button open explorer */}
            <ButtonOpenExplorer address={SOL_ADDRESS} />
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default SolCard
