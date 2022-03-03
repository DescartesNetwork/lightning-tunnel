import { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
  Tooltip,
  Divider,
  Checkbox,
} from 'antd'
import { AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'

const AccountInfo = ({
  index = 0,
  selected = false,
  onChecked = () => {},
}: {
  index: number
  selected?: boolean
  onChecked?: (checked: boolean, index: number) => void
}) => {
  return (
    <Row gutter={[16, 8]}>
      <Col span={24}>
        <Row gutter={[16, 8]} align="middle" wrap={false}>
          {selected && (
            <Col>
              <Checkbox onChange={(e) => onChecked(e.target.value, index)} />
            </Col>
          )}
          <Col>
            <Typography.Text type="secondary">#{index + 1}</Typography.Text>
          </Col>
          <Col span={12}>
            <Tooltip title={'accountAddress'}>
              <Typography.Text ellipsis>{'accountAddress'}</Typography.Text>
            </Tooltip>
          </Col>
          <Col flex="auto">
            <Space>
              <Typography.Text>{'display'}</Typography.Text>
              <Typography.Text>ABC</Typography.Text>
            </Space>
          </Col>
          <Col>
            <Space align="center">
              <Tooltip title={'warning'}>
                <IonIcon
                  name="alert-circle-outline"
                  style={{ color: '#FCB017' }}
                />
              </Tooltip>
              <Tooltip title={'error'}>
                <IonIcon name="warning-outline" style={{ color: '#F2323F' }} />
              </Tooltip>
              <Button type="text" icon={<IonIcon name="trash-outline" />} />
            </Space>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Divider style={{ margin: 0 }} />
      </Col>
    </Row>
  )
}

const ActionButton = ({
  selected = false,
  onSelect,
}: {
  selected?: boolean
  onSelect: () => void
}) => {
  if (selected) return <Button type="text">Cancle</Button>
  return (
    <Space size={24}>
      <Button type="text" size="small" onClick={onSelect}>
        Select
      </Button>
      <Button type="text" size="small" danger>
        Add more
      </Button>
    </Space>
  )
}

const FileDetails = () => {
  const {
    main: { data },
  } = useSelector((state: AppState) => state)
  const [selected, setSelected] = useState(false)
  const [accountSelected, setAccountSelected] = useState<any>()

  const onSelected = (checked: boolean, idx: number) => {
    const nextData = [...accountSelected]
    if (checked) nextData.push(data[idx])
    else nextData.splice(idx, 1)
    setAccountSelected(nextData)
  }
  console.log(accountSelected, 'account selected')

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
              >
                Delete
              </Button>
            )}
          </Col>
          <Col>
            <ActionButton
              selected={selected}
              onSelect={() => setSelected(true)}
            />
          </Col>
          <Col span={24}>
            <Card bordered={false} className="card-content">
              <Row gutter={[8, 8]}>
                {data.length &&
                  data.map((item, idx) => (
                    <Col span={24}>
                      <AccountInfo
                        index={idx}
                        selected={selected}
                        onChecked={onSelected}
                      />
                    </Col>
                  ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default FileDetails
