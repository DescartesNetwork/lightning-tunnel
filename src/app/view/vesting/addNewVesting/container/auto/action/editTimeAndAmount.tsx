import { ChangeEvent, Fragment, useMemo, useState } from 'react'
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

import { addAmountAndTime } from 'app/model/recipients.controller'
import { AppDispatch, AppState } from 'app/model'

const EditTimeAndAmount = ({ walletAddress }: { walletAddress: string }) => {
  const recipientInfo = useSelector(
    (state: AppState) => state.recipients.recipientInfos[walletAddress],
  )
  const decimal = useSelector((state: AppState) => state.setting.decimal)
  const [visible, setVisible] = useState(false)
  const [nextRecipientInfos, setNextRecipientInfos] = useState(recipientInfo)
  const dispatch = useDispatch<AppDispatch>()
  const DEFAULT_VALUE = { unlockTime: 0, amount: '', address: walletAddress }

  const ok = useMemo(() => {
    for (const { amount, unlockTime } of nextRecipientInfos) {
      if (!unlockTime || !amount) return true
      if (!decimal && Number(amount) % 1 !== 0) return true
    }
    return false
  }, [decimal, nextRecipientInfos])

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

  const addMoreTimeAndAmounts = () => {
    dispatch(addAmountAndTime({ walletAddress, nextRecipientInfos }))
    return setVisible(false)
  }

  return (
    <Fragment>
      <Button
        onClick={() => setVisible(true)}
        icon={<IonIcon name="create-outline" />}
        type="text"
      />
      <Modal
        footer={null}
        className="card-lightning"
        style={{ paddingBottom: 0 }}
        closeIcon={<IonIcon name="close-outline" />}
        visible={visible}
        onCancel={() => setVisible(false)}
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
                    <Col span={12}>
                      <Input
                        name="amount"
                        className="recipient-input"
                        placeholder="Input amount"
                        value={amount}
                        onChange={(e) => onAmountChange(e, index)}
                      />
                    </Col>
                    <Col span={12}>
                      <DatePicker
                        placeholder="Select unlock time"
                        suffixIcon={<IonIcon name="time-outline" />}
                        className="date-option"
                        onChange={(date) =>
                          onDateChange(date?.valueOf() || 0, index)
                        }
                        clearIcon={null}
                        showTime={{ showSecond: false }}
                        placement="bottomRight"
                        value={unlockTime ? moment(unlockTime) : null}
                        format={'MM-DD-YYYY HH:mm'}
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
              <Button onClick={() => setVisible(false)} type="ghost">
                Cancel
              </Button>
              <Button
                disabled={ok}
                onClick={addMoreTimeAndAmounts}
                type="primary"
              >
                Add
              </Button>
            </Space>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default EditTimeAndAmount
