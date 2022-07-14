import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Input, Row, Select, Typography } from 'antd'

import { AppDispatch, AppState } from 'model'
import { setGlobalConfigs } from 'model/recipients.controller'
import { ChangeEvent, useState } from 'react'
import parse from 'parse-duration'

export enum FREQUENCY {
  one = '1months',
  three = '3months',
  six = '6months',
  twelve = '12months',
}

type FrequencyItem = {
  label: string
  value: string
}

const DISTRIBUTION_FREQUENCY: FrequencyItem[] = [
  { label: '1 months', value: FREQUENCY.one },
  { label: '3 months', value: FREQUENCY.three },
  { label: '6 months', value: FREQUENCY.six },
  { label: '12 months', value: FREQUENCY.twelve },
]

const Frequency = () => {
  const [nextFrequency, setNextFrequency] = useState('')
  const [listFrequency, setListFrequency] = useState(DISTRIBUTION_FREQUENCY)
  const frequency = useSelector(
    (state: AppState) => state.recipients.configs.frequency,
  )
  const dispatch = useDispatch<AppDispatch>()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNextFrequency(e.target.value)
  }

  const addFrequency = (val?: string) => {
    if (val) return dispatch(setGlobalConfigs({ configs: { frequency: val } }))
    if (!parse(nextFrequency)) return
    const nextListTime = [...listFrequency]
    const index = nextListTime.findIndex((item) => item.value === nextFrequency)
    if (index === -1)
      nextListTime.push({ label: nextFrequency, value: nextFrequency })
    setListFrequency(nextListTime)
    setNextFrequency('')
    return dispatch(setGlobalConfigs({ configs: { frequency: nextFrequency } }))
  }

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text className="caption">
          Distribution frequency
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Select
          value={frequency}
          className="select-vesting-data"
          placement="bottomRight"
          onChange={(value) =>
            dispatch(setGlobalConfigs({ configs: { frequency: value } }))
          }
          dropdownRender={(menu) => (
            <>
              {menu}
              {!parse(nextFrequency) && nextFrequency && (
                <Typography.Text
                  style={{ color: '#F9575E' }}
                  className="caption"
                >
                  Wrong format
                </Typography.Text>
              )}
              <Input
                onChange={onChange}
                placeholder="E.g: 1d, 1months, 1y,..."
                value={nextFrequency}
                suffix={
                  <Button
                    style={{ color: '#42E6EB' }}
                    onClick={() => addFrequency()}
                    type="text"
                  >
                    Add
                  </Button>
                }
              />
            </>
          )}
        >
          {listFrequency.map(({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  )
}

export default Frequency
