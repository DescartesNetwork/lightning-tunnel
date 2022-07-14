import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { util } from '@sentre/senhub'

import { numeric, shortenAddress } from '@sentre/senhub/dist/shared/util'
import { Button, Col, Row, Space, Tooltip, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { MintSymbol } from 'shared/antd/mint'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import { EMPTY_SELECT_VAL } from './selectTokens'

type MintInfoProps = {
  mintAddress: string
}
const MintInfo = ({ mintAddress }: MintInfoProps) => {
  const [copied, setCopied] = useState(false)
  const { balance } = useAccountBalanceByMintAddress(mintAddress)

  const onCopy = async () => {
    setCopied(true)
    await util.asyncWait(1500)
    setCopied(false)
  }
  return (
    <Row
      gutter={[8, 8]}
      style={{ background: '#233333', height: 70, padding: '12px 16px' }}
    >
      <Col span={12}>
        <Space size={4} direction="vertical">
          <Typography.Text className="caption" type="secondary">
            Balance
          </Typography.Text>
          {balance ? (
            <Typography.Text>
              {numeric(balance).format('0.0,[0000]')}{' '}
              <MintSymbol mintAddress={mintAddress} />
            </Typography.Text>
          ) : (
            0
          )}
        </Space>
      </Col>
      <Col span={12}>
        <Space size={0} direction="vertical">
          <Typography.Text className="caption" type="secondary">
            Mint address
          </Typography.Text>
          {mintAddress !== EMPTY_SELECT_VAL ? (
            <Space>
              <Typography.Text>{shortenAddress(mintAddress)}</Typography.Text>
              <Tooltip title="Copied" visible={copied}>
                <CopyToClipboard text={mintAddress}>
                  <Button
                    type="text"
                    onClick={onCopy}
                    icon={<IonIcon name="copy-outline" />}
                  />
                </CopyToClipboard>
              </Tooltip>
            </Space>
          ) : (
            '--'
          )}
        </Space>
      </Col>
    </Row>
  )
}

export default MintInfo
