import { web3 } from '@project-serum/anchor'
import { MintAmount, MintAvatar, MintName, MintSymbol } from '@sen-use/app/dist'
import { util } from '@sentre/senhub/dist'
import { DistributorData } from '@sentre/utility'
import { Card, Col, Row, Space, Table, Typography } from 'antd'
import { AppState } from 'model'
import { useSelector } from 'react-redux'

const Statistics = () => {
  const distributors = useSelector((state: AppState) => state.distributors)

  const columns = [
    {
      title: 'AUTHORITY',
      dataIndex: 'authority',
      key: 'authority',
      render: (authority: web3.PublicKey) => (
        <Typography.Text>
          {util.shortenAddress(authority.toBase58())}
        </Typography.Text>
      ),
    },
    {
      title: 'TOKEN',
      dataIndex: 'mint',
      key: 'mint',
      render: (mint: web3.PublicKey) => (
        <Space>
          <MintAvatar size={24} mintAddress={mint.toBase58()} />
          <MintName mintAddress={mint.toBase58()} />
        </Space>
      ),
    },
    {
      title: 'AMOUNT',
      dataIndex: 'mint',
      key: 'mint',
      render: (mint: web3.PublicKey, { total }: DistributorData) => (
        <Space>
          <MintAmount mintAddress={mint.toBase58()} amount={total} />
          <MintSymbol mintAddress={mint.toBase58()} />
        </Space>
      ),
    },
  ]

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={2}>
          Golden Board Lightning tunnel
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Card className="card-lightning">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Typography.Text className="amount-airdrop">
                {Object.keys(distributors).length}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Table
                dataSource={Object.values(distributors)}
                columns={columns}
                pagination={false}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Statistics
