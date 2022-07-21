import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { MerkleDistributor, FeeOptions } from '@sentre/utility'
import { utilsBN } from 'sentre-web3'
import { util } from '@sentre/senhub'
import { shortenAddress } from '@sentre/senhub/dist/shared/util'
import BN from 'bn.js'

import { Button, Col, Modal, Row, Space, Table, Typography } from 'antd'
import useReceipts from 'hooks/useReceipts'
import IonIcon from '@sentre/antd-ionicon'

import { AppState } from 'model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { notifyError, notifySuccess } from 'helper'
import configs from 'configs'

const {
  sol: { utility, fee, taxman },
} = configs

type Unclaimed = {
  amount: BN
  authority: string
  mintAddress: string
}

const ColumnAmount = ({
  amount,
  mintAddress,
}: {
  amount: BN
  mintAddress: string
}) => {
  const decimal = useMintDecimals(mintAddress) || 0
  return (
    <Typography.Text>
      {util.numeric(utilsBN.undecimalize(amount, decimal)).format('0,0.[0000]')}
    </Typography.Text>
  )
}

const COLUMN = [
  {
    title: 'WALLET ADDRESS',
    dataIndex: 'authority',
    render: (authority: string) => (
      <Typography.Text>{shortenAddress(authority)}</Typography.Text>
    ),
  },
  {
    title: 'AMOUNT',
    dataIndex: 'amount',
    render: (amount: BN, { mintAddress }: Unclaimed) => (
      <ColumnAmount amount={amount} mintAddress={mintAddress} />
    ),
  },
]

const RevokeAction = ({
  distributorAddress,
  treeData,
  disabled,
  setDisabled,
}: {
  distributorAddress: string
  treeData: Buffer
  disabled: boolean
  setDisabled: (val: boolean) => void
}) => {
  const [unclaimed, setUnclaimed] = useState<Unclaimed[]>([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const receipts = useReceipts({ distributorAddress })
  const mint = useSelector(
    (state: AppState) => state.distributors[distributorAddress].mint,
  )

  const getUnclaimedList = useCallback(() => {
    if (!treeData) return 0
    const parseData = JSON.parse(JSON.stringify(treeData)).data
    const merkleDistributor = MerkleDistributor.fromBuffer(
      Buffer.from(parseData || treeData),
    )
    const listUnclaimed: Unclaimed[] = []
    const recipients = merkleDistributor.receipients
    for (const { authority, amount, salt } of recipients) {
      if (!receipts[authority.toBase58()]) {
        listUnclaimed.push({
          authority: authority.toBase58(),
          amount,
          mintAddress: mint.toBase58(),
        })
        continue
      }

      const receiptSalt = Buffer.from(receipts[authority.toBase58()].salt)
      if (Buffer.compare(receiptSalt, salt) !== 0)
        listUnclaimed.push({
          authority: authority.toBase58(),
          amount,
          mintAddress: mint.toBase58(),
        })
    }
    return setUnclaimed(listUnclaimed)
  }, [mint, receipts, treeData])

  const filterUnclaimed = useMemo(() => {
    const data: Record<string, Unclaimed> = {}
    for (const item of unclaimed) {
      const { authority, amount } = item
      if (data[authority]) {
        const oldData = data[item.authority]
        data[item.authority] = {
          ...oldData,
          amount: oldData.amount.add(amount),
        }
        continue
      }
      data[authority] = item
    }
    return data
  }, [unclaimed])

  const onRevoke = async () => {
    const feeOptions: FeeOptions = {
      fee: new BN(fee),
      feeCollectorAddress: taxman,
    }
    setLoading(true)
    try {
      const { txId } = await utility.revoke({ distributorAddress, feeOptions })
      notifySuccess('Revoked token', txId)
      return setDisabled(true)
    } catch (er) {
      notifyError(er)
    } finally {
      setLoading(false)
      setVisible(false)
    }
  }

  useEffect(() => {
    getUnclaimedList()
  }, [getUnclaimedList])

  return (
    <Fragment>
      <Button
        onClick={() => setVisible(true)}
        type="text"
        disabled={disabled}
        style={{ color: '#42E6EB' }}
      >
        revoke
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        closeIcon={<IonIcon name="close-outline" />}
        className="card-lightning"
        style={{ paddingBottom: 0 }}
      >
        <Row gutter={[32, 32]}>
          <Col span={24}>
            <Typography.Title level={5}>Revoke</Typography.Title>
          </Col>
          <Col span={24}>
            <Table
              dataSource={Object.values(filterUnclaimed)}
              pagination={false}
              columns={COLUMN}
              rowKey={(record) => record.authority}
            />
          </Col>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="ghost" onClick={() => setVisible(false)}>
                Cancel
              </Button>
              <Button onClick={onRevoke} loading={loading} type="primary">
                confirm
              </Button>
            </Space>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default RevokeAction
