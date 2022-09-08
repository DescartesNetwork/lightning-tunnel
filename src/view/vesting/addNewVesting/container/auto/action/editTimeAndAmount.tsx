import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import {
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Space,
  Typography,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import OverviewRecipient from './overViewRecipient'

import { addAmountAndTime, RecipientInfo } from 'model/recipients.controller'
import { AppDispatch, AppState } from 'model'
import { FORMAT_DATE } from '../../../../../../constants'

type EditTimeAndAmountProps = {
  visible: boolean
  setVisible: (visible: boolean) => void
  walletAddress: string
}

const EditTimeAndAmount = ({
  walletAddress,
  setVisible,
  visible,
}: EditTimeAndAmountProps) => {
  const [nextRecipientInfos, setNextRecipientInfos] = useState<RecipientInfo[]>(
    [],
  )
  const recipientInfo = useSelector(
    (state: AppState) => state.recipients.recipientInfos[walletAddress],
  )
  const expirationTime = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  const decimal = useSelector((state: AppState) => state.setting.decimal)
  const dispatch = useDispatch<AppDispatch>()
  const DEFAULT_VALUE = { unlockTime: 0, amount: '', address: walletAddress }

  const disabled = useMemo(() => {
    for (const { amount, unlockTime } of nextRecipientInfos) {
      if (!unlockTime || !amount) return true
      if (unlockTime > expirationTime && expirationTime) return true
      if (!decimal && Number(amount) % 1 !== 0) return true
    }
    return false
  }, [decimal, expirationTime, nextRecipientInfos])

  const onAdd = () => {
    const data = [...nextRecipientInfos]
    data.push(DEFAULT_VALUE)
    return setNextRecipientInfos(data)
  }

  const onDateChange = (unlockTime: number, index: number) => {
    const data = [...nextRecipientInfos]
    data[index] = { ...data[index], unlockTime }
    return setNextRecipientInfos(data)
  }

  const onAmountChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const data = [...nextRecipientInfos]
    data[index] = { ...data[index], amount: e.target.value }
    return setNextRecipientInfos(data)
  }

  const addMoreTimeAndAmounts = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    dispatch(addAmountAndTime({ walletAddress, nextRecipientInfos }))
    return setVisible(false)
  }

  const onRemove = (index: number) => {
    const data = [...nextRecipientInfos]
    data.splice(index, 1)
    return setNextRecipientInfos(data)
  }
  useEffect(() => {
    setNextRecipientInfos(recipientInfo)
  }, [recipientInfo])

  return (
    <Modal
      footer={null}
      className="card-lightning"
      style={{ paddingBottom: 0 }}
      closeIcon={<IonIcon name="close-outline" />}
      visible={visible}
      onCancel={(e) => {
        e.stopPropagation()
        return setVisible(false)
      }}
    >
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Typography.Title level={4}>
            Edit amount & unlock time
          </Typography.Title>
        </Col>

        <Col span={24}>
          <Row gutter={[16, 16]}>
            {nextRecipientInfos.map(({ amount, unlockTime }, index) => (
              <Col span={24} key={index}>
                <Row gutter={[16, 16]}>
                  <Col span={11}>
                    <Input
                      name="amount"
                      className="recipient-input"
                      placeholder="Input amount"
                      value={amount}
                      onChange={(e) => onAmountChange(e, index)}
                    />
                  </Col>
                  <Col span={11}>
                    <DatePicker
                      placeholder="Select unlock time"
                      suffixIcon={<IonIcon name="time-outline" />}
                      className={
                        unlockTime > expirationTime && expirationTime
                          ? 'date-option error'
                          : 'date-option'
                      }
                      onChange={(date) =>
                        onDateChange(date?.valueOf() || 0, index)
                      }
                      clearIcon={null}
                      showTime={{ showSecond: false }}
                      placement="bottomRight"
                      value={unlockTime ? moment(unlockTime) : null}
                      format={FORMAT_DATE}
                    />
                  </Col>
                  <Col span={2}>
                    <Button
                      onClick={() => onRemove(index)}
                      type="text"
                      icon={<IonIcon name="remove-circle-outline" />}
                    />
                  </Col>
                  {!decimal && Number(amount) % 1 !== 0 && (
                    <Col span={24}>
                      <Space size={12}>
                        <IonIcon
                          style={{ color: '#F9575E' }}
                          name="warning-outline"
                        />
                        <Typography.Text style={{ color: '#F9575E' }}>
                          Should be natural numbers
                        </Typography.Text>
                      </Space>
                    </Col>
                  )}
                </Row>
              </Col>
            ))}
            <Col span={24}>
              <Button
                icon={<IonIcon name="add-outline" />}
                size="large"
                type="dashed"
                block
                style={{ background: 'transparent' }}
                onClick={onAdd}
              >
                Add more
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <OverviewRecipient walletAddress={walletAddress} />
        </Col>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                return setVisible(false)
              }}
              type="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={disabled}
              onClick={addMoreTimeAndAmounts}
              type="primary"
            >
              update
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  )
}

export default EditTimeAndAmount
