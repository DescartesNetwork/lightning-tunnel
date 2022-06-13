import IonIcon from '@sentre/antd-ionicon'
import { Col, DatePicker, Row, Space, Typography, Switch } from 'antd'
import { useState } from 'react'

type DateOptionProps = {
  placeholder: string
  switchText: string
  onChange: (value: number) => void
  onSwitch: (value: boolean) => void
  label: string
}

const DateOption = ({
  placeholder,
  switchText,
  onChange,
  onSwitch,
  label,
}: DateOptionProps) => {
  const [disabled, setDisabled] = useState(false)
  const onSwitchChange = (isDisable: boolean) => {
    setDisabled(isDisable)
    onSwitch(isDisable)
  }
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>{label}</Col>
      <Col span={24}>
        <DatePicker
          placeholder={placeholder}
          suffixIcon={<IonIcon name="time-outline" />}
          className="date-option"
          onChange={(date) => onChange(date?.valueOf() || 0)}
          disabled={disabled}
          clearIcon={null}
        />
      </Col>
      <Col span={24}>
        <Space>
          <Switch onChange={onSwitchChange} />
          <Typography.Text>{switchText}</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default DateOption
