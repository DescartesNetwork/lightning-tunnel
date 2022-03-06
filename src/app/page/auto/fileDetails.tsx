import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
import { AppDispatch, AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import { setData, TransferData } from 'app/model/main.controller'
import { shortenAddress } from 'shared/util'

type AccountInfoProps = {
  email?: string
  accountAddress?: string
  amount?: string
  index: number
  selected?: boolean
  onChecked?: (checked: boolean, index: number) => void
}

const AccountInfo = ({
  email = '',
  accountAddress = '',
  amount = '',
  index = 0,
  selected = false,
  onChecked = (checked: boolean, index: number) => {},
}: AccountInfoProps) => {
  return (
    <Row gutter={[16, 8]}>
      <Col span={24}>
        <Row
          gutter={[16, 8]}
          align="middle"
          justify="space-between"
          wrap={false}
        >
          <Col>
            <Space>
              {selected && (
                <Checkbox
                  onChange={(e) => onChecked(e.target.checked, index)}
                />
              )}
              <Typography.Text type="secondary">#{index + 1}</Typography.Text>
            </Space>
          </Col>
          <Col>
            <Typography.Text>{shortenAddress(email, 8)}</Typography.Text>
          </Col>
          <Col>
            <Tooltip title={accountAddress}>
              <Typography.Text>
                {shortenAddress(accountAddress)}
              </Typography.Text>
            </Tooltip>
          </Col>
          <Col>
            <Typography.Text>{amount}</Typography.Text>
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
  onSelect: (selected: boolean) => void
}) => {
  if (selected)
    return (
      <Button type="text" onClick={() => onSelect(false)}>
        Cancle
      </Button>
    )
  return (
    <Space size={24}>
      <Button type="text" size="small" onClick={() => onSelect(true)}>
        Select
      </Button>
      <Button type="text" size="small" danger>
        Add more
      </Button>
    </Space>
  )
}

const FileDetails = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { data },
  } = useSelector((state: AppState) => state)
  const [selected, setSelected] = useState(false)
  const [accountSelected, setAccountSelected] = useState<TransferData>([])

  const onSelected = (checked: boolean, idx: number) => {
    const nextData = [...accountSelected]
    const matchedData = data[idx]
    if (checked) nextData.push(matchedData)
    else {
      const idxNextData = nextData.indexOf(matchedData)
      nextData.splice(idxNextData, 1)
    }
    setAccountSelected(nextData)
  }
  const onDelete = () => {
    if (!accountSelected.length) return
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
                onClick={() => dispatch(setData([]))}
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
                disabled={!accountSelected.length}
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </Col>
          <Col>
            <ActionButton selected={selected} onSelect={setSelected} />
          </Col>
          <Col span={24}>
            <Card bordered={false} className="card-content">
              <Row gutter={[8, 8]}>
                {data.length &&
                  data.map(([email, address, amount], idx) => (
                    <Col span={24} key={idx + address}>
                      <AccountInfo
                        accountAddress={address}
                        amount={amount}
                        email={email}
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
