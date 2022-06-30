import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Collapse, Row, Space, Spin, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AccountInfoHeader from './accountInfoHeader'
import AccountInfo from './accountInfo'
import AddMoreRecipient from '../../components/addMoreRecipient'
import ModalDeleteFile from 'components/commonModal'
import { WrapTotal } from 'components/cardTotal'

import { AppDispatch, AppState } from 'model'
import { CollapseAddNew, RecipientFileType } from '../../../../../constants'
import { addRecipients } from 'model/recipients.controller'
import {
  selectRecipient,
  removeSelectedFile,
  selectAllRecipient,
} from 'model/file.controller'
import useFilteredVestingRecipient from 'hooks/vesting/useFilteredVestingRecipients'
import useValidateAmount from 'hooks/useValidateAmount'

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
    recipients: { recipientInfos },
  } = useSelector((state: AppState) => state)
  const validRecipients = useFilteredVestingRecipient({
    type: RecipientFileType.valid,
  })
  const invalidRecipients = useFilteredVestingRecipient({
    type: RecipientFileType.invalid,
  })

  const onSelected = (checked: boolean, walletAddress: string) =>
    dispatch(selectRecipient({ checked, walletAddress }))

  const onDelete = useCallback(() => {
    if (!selectedFile?.length) return
    setLoading(true)
    const nextRecipients = { ...recipientInfos }
    for (const address of selectedFile) {
      delete nextRecipients[address]
    }
    dispatch(addRecipients({ recipientInfos: nextRecipients }))
    dispatch(removeSelectedFile())
    setLoading(false)
    setSelected(false)
  }, [dispatch, recipientInfos, selectedFile])

  const onSelectAll = (checked: boolean) => {
    if (checked) {
      const allRecipients = invalidRecipients.concat(validRecipients)
      const listAddress = allRecipients.map(({ address }) => address)
      dispatch(selectAllRecipient(listAddress))
    } else dispatch(removeSelectedFile())
  }

  const { amountError } = useValidateAmount()

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
                <AddMoreRecipient />
              </Collapse.Panel>
            </Collapse>
          </Col>
          <Col span={24}>
            <Spin spinning={loading}>
              <Card bordered={false} className="card-content">
                <Row>
                  <Col span={24}>
                    <AccountInfoHeader
                      selected={selected}
                      onChecked={onSelectAll}
                    />
                  </Col>
                  {invalidRecipients.map((vestingItem, idx) => (
                    <Col
                      span={24}
                      key={vestingItem.address + idx}
                      className={
                        idx + 1 === invalidRecipients.length
                          ? 'last-item-error-data'
                          : ''
                      }
                    >
                      <AccountInfo
                        vestingItem={vestingItem}
                        selected={selected}
                        onChecked={onSelected}
                        index={validRecipients.length + idx}
                      />
                    </Col>
                  ))}
                  {validRecipients.map((vestingItem, idx) => (
                    <Col span={24} key={vestingItem.address + idx}>
                      <AccountInfo
                        vestingItem={vestingItem}
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
