import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@senhub/providers'

import { Col, Modal, Row, Space, Typography, Table } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import PDB from 'shared/pdb'
import { HISTORY_COLUMN } from './column'
import { History } from 'app/constants'

import './index.less'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'

const ListHistory = ({
  visible,
  setVisible,
}: {
  visible: boolean
  setVisible: (visible: boolean) => void
}) => {
  const [histories, setHistories] = useState<History[]>([])
  const {
    main: { currentHistory },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const fetchHistory = useCallback(async () => {
    const db = new PDB(walletAddress).createInstance('lightning_tunnel')
    const history: History[] = (await db.getItem('history')) || []
    if (currentHistory) history.push(currentHistory)
    return setHistories(history)
  }, [currentHistory, walletAddress])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      closeIcon={<IonIcon name="close-outline" />}
      footer={false}
      className="card-lightning"
      style={{ paddingBottom: 0 }}
    >
      <Row gutter={[32, 32]} style={{ maxHeight: 500 }} className="scrollbar">
        <Col span={24}>
          <Typography.Title level={5}>Transfer history</Typography.Title>
        </Col>
        <Col span={24}>
          <Space align="baseline">
            <IonIcon name="information-circle-outline" />
            <Typography.Text>
              The history of each transaction is saved only on the device where
              the transaction was made.
            </Typography.Text>
          </Space>
        </Col>
        <Col span={24}>
          <Table
            columns={HISTORY_COLUMN}
            dataSource={histories}
            pagination={false}
            rowKey={(record) => record.cid}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default ListHistory
