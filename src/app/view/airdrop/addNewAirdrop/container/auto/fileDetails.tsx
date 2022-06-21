import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Collapse, Row, Space, Spin, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import InputInfoTransfer from 'app/components/inputInfoTransfer'
import { WrapTotal } from 'app/components/cardTotal'
import AccountInfoHeader from './accountInfoHeader'
import AccountInfo from './accountInfo'
import ModalDeleteFile from 'app/components/commonModal'

import { AppDispatch, AppState } from 'app/model'
import { CollapseAddNew } from 'app/constants'
import { addRecipients, setErrorData } from 'app/model/recipients.controller'
import { onSelectedFile, removeSelectedFile } from 'app/model/file.controller'
import useValidateAmount from 'app/hooks/useValidateAmount'

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
        Cancel
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

const FileDetails = ({ remove = () => {} }: { remove?: () => void }) => {
  const [selected, setSelected] = useState(false)
  const [activeKey, setActiveKey] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    file: { fileName, selectedFile },
    recipients2: { recipients, errorData },
  } = useSelector((state: AppState) => state)
  // const { amountError } = useValidateAmount()
  const amountError = false

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
    setSelected(false)
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
                onClick={() => setVisible(true)}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[12, 12]}>
          <Col flex="auto">
            {selected && (
              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<IonIcon name="trash-outline" />}
                  onClick={onDelete}
                  disabled={!selectedFile?.length}
                >
                  Delete
                </Button>
              </Space>
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
                  {errorData.map(([address, amount], idx) => (
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
          {amountError && (
            <Col span={24}>
              <Space size={12}>
                <IonIcon style={{ color: '#F9575E' }} name="warning-outline" />
                <Typography.Text style={{ color: '#F9575E' }}>
                  Should be natural numbers
                </Typography.Text>
              </Space>
            </Col>
          )}
          <Col span={24}>
            <WrapTotal />
          </Col>
        </Row>
      </Col>
      <ModalDeleteFile
        title="Do you want to delete this file? "
        description="Data will not be saved."
        visible={visible}
        setVisible={setVisible}
        onConfirm={remove}
        onCancel={() => setVisible(false)}
        btnText="delete"
      />
    </Row>
  )
}
export default FileDetails
