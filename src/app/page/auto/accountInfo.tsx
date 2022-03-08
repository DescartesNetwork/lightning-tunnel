// import { useDispatch, useSelector } from 'react-redux'

import {
  Button,
  Col,
  Row,
  Space,
  Typography,
  Tooltip,
  Checkbox,
  Input,
} from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { shortenAddress } from 'shared/util'
// import { AppDispatch, AppState } from 'app/model'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'

type AccountInfoProps = {
  accountAddress?: string
  selected?: boolean
  walletsSelected?: number[]
  email?: string
  amount?: number | string
  index: number
  onChecked?: (checked: boolean, index: number) => void
}

type EditButtonProps = {
  isEdited?: boolean
  onEdited?: (isEdited: boolean) => void
  onUpdate?: () => void
}

const EditButton = ({
  isEdited = false,
  onEdited = () => {},
  onUpdate = () => {},
}: EditButtonProps) => {
  if (!isEdited)
    return (
      <Button
        type="text"
        icon={<IonIcon name="create-outline" />}
        onClick={() => onEdited(true)}
      />
    )
  return (
    <Button
      type="text"
      icon={<IonIcon name="cloud-upload-outline" />}
      onClick={onUpdate}
    />
  )
}

const AccountInfo = ({
  accountAddress = '',
  email = '',
  amount = 0,
  selected = false,
  walletsSelected = [],
  onChecked = () => {},
  index,
}: AccountInfoProps) => {
  // const dispatch = useDispatch<AppDispatch>()
  const [isEdited, setIsEdited] = useState(false)
  const [nextEmail, setNextEmail] = useState('')
  const [nextAmount, setNextAmount] = useState('')
  const {
    recipients: { errorDatas },
  } = useSelector((state: AppState) => state)

  const editable = !amount || !email
  const emailValue = isEdited ? nextEmail : shortenAddress(email, 8)
  const amountValue = isEdited ? nextAmount : amount

  const onUpdate = useCallback(() => {
    setIsEdited(false)
  }, [])

  return (
    <Row gutter={[16, 8]}>
      <Col span={24}>
        <Row
          gutter={[16, 8]}
          align="middle"
          justify="space-between"
          wrap={false}
        >
          <Col style={{ minWidth: 40 }}>
            <Space>
              {selected && (
                <Checkbox
                  checked={walletsSelected.includes(index)}
                  onChange={(e) => onChecked(e.target.checked, index)}
                />
              )}
              <Typography.Text type="secondary">#{index + 1}</Typography.Text>
            </Space>
          </Col>
          <Col style={{ minWidth: 140 }}>
            <Tooltip title={accountAddress}>
              <Typography.Text>
                {shortenAddress(accountAddress)}
              </Typography.Text>
            </Tooltip>
          </Col>
          <Col style={{ minWidth: 150 }}>
            <Input
              value={emailValue}
              bordered={false}
              onChange={(e) => setNextEmail(e.target.value)}
              disabled={!isEdited}
            />
          </Col>
          <Col>
            <Input
              value={amountValue}
              bordered={false}
              onChange={(e) => setNextAmount(e.target.value)}
              disabled={!isEdited}
            />
          </Col>
          {!!errorDatas?.length && (
            <Col style={{ minWidth: 70 }}>
              {editable && (
                <Space align="center">
                  <IonIcon
                    name="alert-circle-outline"
                    style={{ color: '#D72311' }}
                  />
                  <EditButton
                    isEdited={isEdited}
                    onEdited={setIsEdited}
                    onUpdate={onUpdate}
                  />
                </Space>
              )}
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  )
}

export default AccountInfo
