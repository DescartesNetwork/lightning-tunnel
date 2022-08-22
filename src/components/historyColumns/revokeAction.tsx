import { Fragment, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { FeeOptions } from '@sentre/utility'
import { utilsBN } from '@sen-use/web3'
import { util, useMintDecimals } from '@sentre/senhub'
import { shortenAddress } from '@sentre/senhub/dist/shared/util'
import { CSVLink } from 'react-csv'
import { BN } from '@project-serum/anchor'

import {
  Button,
  Col,
  Modal,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppState } from 'model'
import { notifyError, notifySuccess } from 'helper'
import configs from 'configs'
import { useUnclaimedList } from 'hooks/useUnclaimedList'

const {
  sol: { utility, fee, taxman },
} = configs

type Unclaimed = {
  amount: BN
  authority: string
  mintAddress: string
}

const CSV_HEADER = [
  { label: 'Wallet address', key: 'authority' },
  { label: 'Amount', key: 'amount' },
]

const ColumnAmount = ({
  amount,
  mintAddress,
}: {
  amount: BN
  mintAddress: string
}) => {
  const decimal = useMintDecimals({ mintAddress }) || 0
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
  disabled,
  setDisabled,
}: {
  distributorAddress: string
  disabled: boolean
  setDisabled: (val: boolean) => void
}) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const mint = useSelector(
    (state: AppState) => state.distributors[distributorAddress].mint,
  )
  const decimal = useMintDecimals({ mintAddress: mint.toBase58() }) || 0
  const { unclaimed } = useUnclaimedList(distributorAddress)

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

  const csvData = useMemo(() => {
    const data = Object.values(filterUnclaimed).map((unclaimed) => {
      const { amount, authority } = unclaimed
      const actualAmount = utilsBN.undecimalize(amount, decimal)
      return {
        authority,
        amount: actualAmount,
      }
    }, [])

    return data
  }, [decimal, filterUnclaimed])

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
        footer={
          <Space>
            <Button type="ghost" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button onClick={onRevoke} loading={loading} type="primary">
              confirm
            </Button>
          </Space>
        }
        closeIcon={<IonIcon name="close-outline" />}
        className="card-lightning"
        style={{ paddingBottom: 0 }}
      >
        <Row gutter={[32, 32]} style={{ maxHeight: 400 }} className="scrollbar">
          <Col span={24}>
            <Space>
              <Typography.Title level={5}>Revoke</Typography.Title>
              <CSVLink
                filename="unclaimed_list"
                headers={CSV_HEADER}
                data={csvData}
              >
                <Tooltip title="Download unclaimed list">
                  <IonIcon style={{ fontSize: 20 }} name="download-outline" />
                </Tooltip>
              </CSVLink>
            </Space>
          </Col>
          <Col span={24}>
            <Table
              dataSource={Object.values(filterUnclaimed)}
              pagination={false}
              columns={COLUMN}
              rowKey={(record) => record.authority}
            />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default RevokeAction
