import { useDispatch, useSelector } from 'react-redux'

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
import { AppDispatch, AppState } from 'app/model'
import { useCallback, useState } from 'react'
import { mergeRecipient } from 'app/model/recipients.controller'

type AccountInfoProps = {
  accountAddress?: string
  selected?: boolean
  error?: boolean
  walletsSelected?: string[]
  onChecked?: (checked: boolean, walletAddress: string) => void
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
  selected = false,
  error = false,
  walletsSelected = [],
  onChecked = () => {},
}: AccountInfoProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isEdited, setIsEdited] = useState(false)
  const [nextEmail, setNextEmail] = useState('')
  const [nextAmount, setNextAmount] = useState('')
  const { recipients } = useSelector((state: AppState) => state.recipients)
  const { email, walletAddress, amount } = recipients[accountAddress]

  const editable = !amount || !email
  const index = Object.keys(recipients).indexOf(accountAddress)
  const emailValue = isEdited ? nextEmail : shortenAddress(email, 8)
  const amountValue = isEdited ? nextAmount : amount

  const onUpdate = useCallback(() => {
    if (!nextEmail || !nextAmount) return
    const nextRecipient = {
      walletAddress,
      email: nextEmail,
      amount: Number(nextAmount),
    }
    dispatch(mergeRecipient({ recipient: nextRecipient }))
    setIsEdited(false)
  }, [dispatch, nextAmount, nextEmail, walletAddress])

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
                  checked={walletsSelected.includes(accountAddress)}
                  onChange={(e) => onChecked(e.target.checked, walletAddress)}
                />
              )}
              <Typography.Text type="secondary">#{index + 1}</Typography.Text>
            </Space>
          </Col>
          <Col style={{ minWidth: 140 }}>
            <Tooltip title={walletAddress}>
              <Typography.Text>{shortenAddress(walletAddress)}</Typography.Text>
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
          {error && (
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
