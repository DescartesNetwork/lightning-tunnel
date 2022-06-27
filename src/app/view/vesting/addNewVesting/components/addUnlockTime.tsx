import moment from 'moment'

import { Button, Col, DatePicker, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

type AddUnlockTimeProps = {
  listUnlockTime: number[]
  setListUnlockTime: (value: number[]) => void
}

const AddUnlockTime = ({
  listUnlockTime,
  setListUnlockTime,
}: AddUnlockTimeProps) => {
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
          </Row>
        </Col>
      ))}
    </Row>
  )
}

export default AddUnlockTime
