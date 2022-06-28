import IonIcon from '@sentre/antd-ionicon'
import { Col, DatePicker, Row, Typography, Switch } from 'antd'
import moment from 'moment'
import { useState } from 'react'

type DateOptionProps = {
  placeholder: string
  switchText: string
  onChange: (value: number) => void
  onSwitch: (value: boolean) => void
  label: string
  value: number
}

const DateOption = ({
  placeholder,
  switchText,
  onChange,
  onSwitch,
  label,
  value,
}: DateOptionProps) => {
  const [disabled, setDisabled] = useState(false)
  const onSwitchChange = (isDisable: boolean) => {
    onChange(0) //clear time
    setDisabled(isDisable)
    onSwitch(isDisable)
  }
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Typography.Text className="caption">{label}</Typography.Text>
          </Col>
          <Col>
            <Row gutter={[8, 8]}>
              <Col xs={{ order: 2 }} lg={{ order: 1 }}>
                <Switch onChange={onSwitchChange} />
              </Col>
              <Col xs={{ order: 1 }} lg={{ order: 2 }}>
                <Typography.Text>{switchText}</Typography.Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <DatePicker
          placeholder={placeholder}
          suffixIcon={<IonIcon name="time-outline" />}
          className="date-option"
          onChange={(date) => onChange(date?.valueOf() || 0)}
          disabled={disabled}
          clearIcon={null}
          value={value ? moment(value) : null}
          showTime={{ showSecond: false }}
          placement="bottomRight"
        />
      </Col>
    </Row>
  )
}

export default DateOption
