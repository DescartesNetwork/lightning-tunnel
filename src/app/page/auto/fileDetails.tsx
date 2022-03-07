import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Collapse, Row, Space, Spin, Typography } from 'antd'
import { AppDispatch, AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import AccountInfo from './accountInfo'
import {
  deleteRecipient,
  removeRecipients,
} from 'app/model/recipients.controller'
import InputInfoTransfer from 'app/components/inputInfoTransfer'
import { CollapseAddNew } from 'app/constants'
import { WrapTotal } from 'app/components/cardTotal'

const ActionButton = ({
  activeKey = '',
  selected = false,
  onSelect,
  onCollapsed,
}: {
  activeKey?: string
  selected?: boolean
  onSelect: (selected: boolean) => void
  onCollapsed: (activeKey: string) => void
}) => {
  if (selected)
    return (
      <Button type="text" size="small" onClick={() => onSelect(false)}>
        Cancle
      </Button>
    )
  if (activeKey)
    return (
      <Button type="text" size="small" onClick={() => onCollapsed('')}>
        Close
      </Button>
    )

  return (
    <Space size={24}>
      <Button type="text" size="small" onClick={() => onSelect(true)}>
        Select
      </Button>
      <Button
        type="text"
        size="small"
        onClick={() => onCollapsed(CollapseAddNew.activeKey)}
        danger
      >
        Add more
      </Button>
    </Space>
  )
}

const FileDetails = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  const [selected, setSelected] = useState(false)
  const [activeKey, setActiveKey] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [walletsSelected, setWalletsSeletectd] = useState<string[]>([])

  const onSelected = (checked: boolean, walletAddress: string) => {
    const nextWalletSelected = [...walletsSelected]
    if (checked) nextWalletSelected.push(walletAddress)
    else {
      const idxOfWallet = nextWalletSelected.indexOf(walletAddress)
      nextWalletSelected.splice(idxOfWallet, 1)
    }
    return setWalletsSeletectd(nextWalletSelected)
  }
  const onDelete = async () => {
    if (!walletsSelected.length || !Object.keys(recipients).length) return
    setLoading(true)
    await walletsSelected.forEach((walletAddress) => {
      if (!!recipients[walletAddress])
        return dispatch(deleteRecipient({ walletAddress }))
    })
    return setLoading(false)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card className="file-uploaded" bodyStyle={{ padding: '8px 16px' }}>
          <Row gutter={8}>
            <Col flex="auto">
              <Space>
                <IonIcon name="document-attach-outline" />
                <Typography.Text style={{ color: 'inherit' }}>
                  {'File name.csv'}
                </Typography.Text>
              </Space>
            </Col>
            <Col>
              <Button
                type="text"
                size="small"
                style={{ color: 'inherit' }}
                icon={<IonIcon name="close-outline" />}
                onClick={() => dispatch(removeRecipients())}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[12, 12]}>
          <Col flex="auto">
            {selected && (
              <Button
                type="text"
                size="small"
                icon={<IonIcon name="trash-outline" />}
                disabled={!walletsSelected.length}
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </Col>
          <Col>
            <ActionButton
              activeKey={activeKey}
              selected={selected}
              onSelect={setSelected}
              onCollapsed={setActiveKey}
            />
          </Col>
          <Col span={24}>
            <Collapse
              activeKey={activeKey}
              bordered={false}
              className="auto-add-new"
            >
              <Collapse.Panel header={undefined} key={CollapseAddNew.activeKey}>
                <InputInfoTransfer />
              </Collapse.Panel>
            </Collapse>
          </Col>
          <Col span={24}>
            <Spin spinning={loading}>
              <Card bordered={false} className="card-content">
                <Row gutter={[8, 8]}>
                  {recipients &&
                    Object.keys(recipients).map((addr, idx) => (
                      <Col span={24} key={addr + idx}>
                        <AccountInfo
                          accountAddress={addr}
                          index={idx}
                          selected={selected}
                          onChecked={onSelected}
                        />
                      </Col>
                    ))}
                </Row>
              </Card>
            </Spin>
          </Col>
          <Col span={24}>
            <WrapTotal />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default FileDetails
