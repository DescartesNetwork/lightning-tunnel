import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Card, Col, Collapse, Row, Space, Spin, Typography } from 'antd'
import InputInfoTransfer from 'app/components/inputInfoTransfer'
import { WrapTotal } from 'app/components/cardTotal'
import AccountInfoHeader from './accountInfoHeader'

import { AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import AccountInfo from './accountInfo'
import { CollapseAddNew } from 'app/constants'

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

const FileDetails = ({ onRemove = () => {} }: { onRemove?: () => void }) => {
  // const dispatch = useDispatch<AppDispatch>()
  const {
    main: { fileName },
    recipients: { recipients, errorDatas },
  } = useSelector((state: AppState) => state)
  const [selected, setSelected] = useState(false)
  const [activeKey, setActiveKey] = useState<string>()
  const [loading, setLoading] = useState(false)
  // const [walletsSelected, setWalletsSeletectd] = useState<string[]>([])

  const onSelected = (checked: boolean, index: number) => {}
  const onSelectAll = (checked: boolean) => {}

  const onDelete = async () => {
    setLoading(true)
    setLoading(false)
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
                  {fileName}
                </Typography.Text>
              </Space>
            </Col>
            <Col>
              <Button
                type="text"
                size="small"
                style={{ color: 'inherit' }}
                icon={<IonIcon name="close-outline" />}
                onClick={onRemove}
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
                  <Col span={24}>
                    <AccountInfoHeader
                      selected={selected}
                      onChecked={onSelectAll}
                    />
                  </Col>
                  {errorDatas?.map(([address, email, amount], idx) => (
                    <Col
                      span={24}
                      key={address + idx}
                      className={
                        idx === errorDatas.length ? 'last-item-error-data' : ''
                      }
                    >
                      <AccountInfo
                        accountAddress={address}
                        email={email}
                        amount={amount}
                        selected={selected}
                        onChecked={onSelected}
                        index={idx}
                      />
                    </Col>
                  ))}
                  {recipients.map(([address, email, amount], idx) => (
                    <Col span={24} key={address + idx}>
                      <AccountInfo
                        accountAddress={address}
                        email={email}
                        amount={amount}
                        selected={selected}
                        onChecked={onSelected}
                        index={idx}
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
