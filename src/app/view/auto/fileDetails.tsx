import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Collapse, Row, Space, Spin, Typography } from 'antd'
import InputInfoTransfer from 'app/components/inputInfoTransfer'
import { WrapTotal } from 'app/components/cardTotal'
import AccountInfoHeader from './accountInfoHeader'
import AccountInfo from './accountInfo'
import IonIcon from 'shared/antd/ionicon'

import { AppDispatch, AppState } from 'app/model'
import { CollapseAddNew } from 'app/constants'
import { addRecipients, setErrorData } from 'app/model/recipients.controller'
import { onSelectedFile, removeSelectedFile } from 'app/model/main.controller'

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
        SELECT
      </Button>
      <Button
        type="text"
        size="small"
        onClick={() => onCollapsed(CollapseAddNew.activeKey)}
        style={{ color: '#42E6EB' }}
      >
        ADD MORE
      </Button>
    </Space>
  )
}

const FileDetails = ({ onRemove = () => {} }: { onRemove?: () => void }) => {
  const [selected, setSelected] = useState(false)
  const [activeKey, setActiveKey] = useState<string>()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { fileName, selectedFile },
    recipients: { recipients, errorData },
  } = useSelector((state: AppState) => state)

  const onSelected = (checked: boolean, index: number) =>
    dispatch(onSelectedFile({ checked, index }))

  const onDelete = () => {
    if (!selectedFile?.length) return
    setLoading(true)
    const nextRecipients = [...recipients]
    const nextErrorData = [...(errorData || [])]

    const filterRecipient = nextRecipients.filter(
      (_, idx) => !selectedFile.includes(idx),
    )
    // Index of error data in listWalletPos begin from recipients.length
    const filterErrorData = nextErrorData.filter(
      (_, idx) => !selectedFile.includes(recipients.length + idx),
    )

    dispatch(setErrorData({ errorData: filterErrorData }))
    dispatch(addRecipients({ recipients: filterRecipient }))
    dispatch(removeSelectedFile())
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
                disabled={!selectedFile?.length}
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
                <Row gutter={[8, 13]}>
                  <Col span={24}>
                    <AccountInfoHeader
                      selected={selected}
                      onChecked={(checked) =>
                        dispatch(onSelectedFile({ checked }))
                      }
                    />
                  </Col>
                  {errorData?.map(([address, amount], idx) => (
                    <Col
                      span={24}
                      key={address + idx}
                      className={
                        idx + 1 === errorData.length
                          ? 'last-item-error-data'
                          : ''
                      }
                    >
                      <AccountInfo
                        accountAddress={address}
                        amount={amount}
                        selected={selected}
                        onChecked={onSelected}
                        index={recipients.length + idx}
                      />
                    </Col>
                  ))}
                  {recipients.map(([address, amount], idx) => (
                    <Col span={24} key={address + idx}>
                      <AccountInfo
                        accountAddress={address}
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
