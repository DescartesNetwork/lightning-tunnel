import { MouseEvent, useState } from 'react'
import { util } from '@sentre/senhub'
import CopyToClipboard from 'react-copy-to-clipboard'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Row, Space, Tooltip, Typography } from 'antd'
import { MintAvatar, MintName, MintSymbol } from 'shared/antd/mint'

import { useJupiterTokens } from './hooks/useJupiterTokens'

export const Verification = () => {
  return (
    <Tooltip title={'Safe to Go'}>
      <IonIcon
        name="checkmark-circle"
        style={{
          color: '#18A0FB',
          backgroundColor: '#fafafa',
          borderRadius: 6,
          fontSize: 12,
        }}
      />
    </Tooltip>
  )
}

export type MintCardActionsProps = {
  address: string
  direction?: 'horizontal' | 'vertical'
}
export const MintCardActions = ({
  address,
  direction = 'horizontal',
}: MintCardActionsProps) => {
  const [copied, setCopied] = useState(false)

  const onCopy = async (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    setCopied(true)
    await util.asyncWait(1500)
    setCopied(false)
  }

  return (
    <Space size={4} direction={direction} align="start">
      <Tooltip title="Copied" visible={copied} arrowPointAtCenter>
        <CopyToClipboard text={address}>
          <Button
            type="text"
            size="small"
            icon={<IonIcon name="copy-outline" />}
            onClick={onCopy}
            style={{ padding: 0 }}
          />
        </CopyToClipboard>
      </Tooltip>
      <Button
        type="text"
        size="small"
        icon={<IonIcon name="open-outline" />}
        onClick={(e) => {
          e.stopPropagation()
          return window.open(util.explorer(address))
        }}
        style={{ padding: 0 }}
      />
    </Space>
  )
}

export type MintSelectionProps = {
  mintAddress: string
  onClick?: (mintAddress: string) => void
  hoverable?: boolean
  className?: string
}
const MintCard = ({
  mintAddress,
  onClick = () => {},
  hoverable = false,
  className,
}: MintSelectionProps) => {
  const jptTokens = useJupiterTokens()

  const cardCln = hoverable ? `mint-card-hoverable ${className}` : className

  return (
    <Card
      bodyStyle={{ padding: 8 }}
      style={{ boxShadow: 'unset', cursor: 'pointer' }}
      bordered={false}
      className={cardCln}
      onClick={() => onClick(mintAddress)}
    >
      <Row gutter={[16, 16]} align="top">
        <Col>
          <MintAvatar mintAddress={mintAddress} size={36} />
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            {/* Mint symbol */}
            <Space>
              <Typography.Text>
                <MintSymbol mintAddress={mintAddress} />
              </Typography.Text>
              {jptTokens?.verify(mintAddress) && <Verification />}
            </Space>
            {/* Mint name */}
            <Typography.Text type="secondary" className="caption">
              <MintName mintAddress={mintAddress} />
            </Typography.Text>
          </Space>
        </Col>
        {/*  Button open explorer */}
        <Col flex="auto" style={{ textAlign: 'right' }}>
          <MintCardActions address={mintAddress} />
        </Col>
      </Row>
    </Card>
  )
}

export default MintCard
