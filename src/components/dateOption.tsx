import moment from 'moment'

import IonIcon from '@sentre/antd-ionicon'
import { Col, DatePicker, Row, Typography, Switch, Space } from 'antd'
import { ReactNode } from 'react'

type DateOptionProps = {
  placeholder: string
  switchText: string
  onChange: (value: number) => void
  onSwitch: (value: boolean) => void
  label: string
  value: number
  error: string
  checked: boolean
  explain?: ReactNode
}

const DateOption = ({
  placeholder,
  switchText,
  onChange,
  onSwitch,
  label,
  value,
  error,
  checked,
  explain,
}: DateOptionProps) => {
  const onSwitchChange = (isDisable: boolean) => {
    onChange(0) //clear time
    onSwitch(isDisable)
  }
  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Row>
          <Col flex="auto">
            <Space align="baseline">
              <Typography.Text className="caption">{label}</Typography.Text>
              {explain}
            </Space>
          </Col>
          <Col>
            <Row gutter={[8, 8]}>
              <Col xs={{ order: 2 }} lg={{ order: 1 }}>
                <Typography.Text>{switchText}</Typography.Text>
              </Col>
              <Col xs={{ order: 1 }} lg={{ order: 2 }}>
                <Switch
                  size="small"
                  checked={checked}
                  onChange={onSwitchChange}
                />
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
          disabled={checked}
          clearIcon={null}
          value={value ? moment(value) : null}
          showTime={{ showSecond: false }}
          placement="bottomRight"
          format={'MM-DD-YYYY HH:mm'}
        />
      </Col>
      {error && (
        <Col span={24}>
          <Typography.Text className="caption" style={{ color: '#F9575E' }}>
            {error}
          </Typography.Text>
        </Col>
      )}
    </Row>
  )
}

export default DateOption
