import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Collapse, Row, Space, Spin, Typography } from 'antd'
import InputInfoTransfer from 'app/components/inputInfoTransfer'
import { WrapTotal } from 'app/components/cardTotal'
import AccountInfoHeader from './accountInfoHeader'

import { AppDispatch, AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import AccountInfo from './accountInfo'
import { CollapseAddNew } from 'app/constants'
import {
  addRecipients,
  mergeRecipient,
  setErrorDatas,
} from 'app/model/recipients.controller'
import { onSelectedFile, removeSelectedFile } from 'app/model/main.controller'
import useCanMerge from 'app/hooks/useCanMerge'

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
  const [selected, setSelected] = useState(false)
  const [activeKey, setActiveKey] = useState<string>()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { fileName, selectedFile },
    recipients: { recipients, errorDatas },
  } = useSelector((state: AppState) => state)
  const canMerge = useCanMerge()

  const onSelected = (checked: boolean, index: number) =>
    dispatch(onSelectedFile({ checked, index }))

  const onDelete = () => {
    if (!selectedFile?.length) return
    setLoading(true)
    const nextRecipients = [...recipients]
    const nextErrorDatas = [...(errorDatas || [])]

    const filterRecipient = nextRecipients.filter(
      (_, idx) => !selectedFile.includes(idx),
    )
    // Index of error data in listWalletPos begin from recipients.length
    const filterErrorData = nextErrorDatas.filter(
      (_, idx) => !selectedFile.includes(recipients.length + idx),
    )

    dispatch(setErrorDatas({ errorDatas: filterErrorData }))
    dispatch(addRecipients({ recipients: filterRecipient }))
    dispatch(removeSelectedFile())
    setLoading(false)
  }

  // Need to merge
  const duplicated = useMemo(() => {
    if (!recipients?.length) return false
    const duplicatedElements = recipients.filter(([address], index) => {
      const expectedIndex = recipients.findIndex(
        ([expectedAddress]) => address === expectedAddress,
      )
      return expectedIndex !== index && expectedIndex > -1
    })
    if (duplicatedElements.length > 0) return true
    return false
  }, [recipients])

  const onMerge = () => {
    if (!duplicated || !selectedFile) return
    if (!canMerge)
      return window.notify({
        type: 'error',
        description: "Can't merge different wallet addresses & emails!",
      })

    dispatch(mergeRecipient({ listIndex: selectedFile }))
    return dispatch(removeSelectedFile())
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
                <Button
                  type="text"
                  size="small"
                  icon={<IonIcon name="git-branch-outline" />}
                  onClick={onMerge}
                  disabled={!selectedFile?.length && duplicated}
                >
                  Merge
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
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <AccountInfoHeader
                      selected={selected}
                      onChecked={(checked) =>
                        dispatch(onSelectedFile({ checked }))
                      }
                    />
                  </Col>
                  {errorDatas?.map(([address, email, amount], idx) => (
                    <Col
                      span={24}
                      key={address + idx}
                      className={
                        idx + 1 === errorDatas.length
                          ? 'last-item-error-data'
                          : ''
                      }
                    >
                      <AccountInfo
                        accountAddress={address}
                        email={email}
                        amount={amount}
                        selected={selected}
                        onChecked={onSelected}
                        index={recipients.length + idx}
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
