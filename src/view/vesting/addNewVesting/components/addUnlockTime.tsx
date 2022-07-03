import moment from 'moment'

import { Button, Col, DatePicker, Row, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { useSelector } from 'react-redux'
import { AppState } from 'model'
import { useCallback } from 'react'

type AddUnlockTimeProps = {
  listUnlockTime: number[]
  setListUnlockTime: (value: number[]) => void
}

const AddUnlockTime = ({
  listUnlockTime,
  setListUnlockTime,
}: AddUnlockTimeProps) => {
  const expiration = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  const checkValid = useCallback(
    (unlockTime: number) => {
      if (!expiration) return true
      if (unlockTime > expiration) return false
      return true
    },
    [expiration],
  )

  const onAdd = () => {
    const data = [...listUnlockTime]
    data.push(0)
    return setListUnlockTime(data)
  }

  const onRemove = (index: number) => {
    const data = [...listUnlockTime]
    data.splice(index, 1)
    return setListUnlockTime(data)
  }

  const onDateChange = (unlockTime: number, index: number) => {
    const data = [...listUnlockTime]
    data[index] = unlockTime
    return setListUnlockTime(data)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col md={12} xl={6}>
        <Button
          onClick={onAdd}
          icon={<IonIcon name="add-outline" />}
          type="dashed"
          block
          size="large"
        >
          Add unlock time
        </Button>
      </Col>
      {listUnlockTime.map((unlockTime, index) => (
        <Col md={12} xl={6} key={index + unlockTime}>
          <Row gutter={[8, 8]} justify="space-between" align="middle">
            <Col span={22}>
              <DatePicker
                className="date-option"
                suffixIcon={<IonIcon name="time-outline" />}
                clearIcon={null}
                placeholder="Select time"
                value={unlockTime ? moment(unlockTime) : null}
                onChange={(date) => onDateChange(date?.valueOf() || 0, index)}
                showTime={{ showSecond: false }}
              />
            </Col>
            <Col span={2}>
              <Button
                onClick={() => onRemove(index)}
                type="text"
                icon={<IonIcon name="remove-circle-outline" />}
              />
            </Col>
            {!checkValid(unlockTime) && (
              <Col span={24}>
                <Typography.Text
                  className="caption"
                  style={{ color: '#F9575E' }}
                >
                  Must be less than expiration time.
                </Typography.Text>
              </Col>
            )}
          </Row>
        </Col>
      ))}
    </Row>
  )
}

export default AddUnlockTime
