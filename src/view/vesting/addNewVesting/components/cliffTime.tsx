import { ChangeEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import parse from 'parse-duration'

import { Button, Col, Input, Row, Select, Typography } from 'antd'

import { AppDispatch, AppState } from 'model'
import { setGlobalConfigs } from 'model/recipients.controller'

export enum CLIFF_TIME {
  one_months = '1months',
  three_months = '3months',
  six_months = '6months',
  twelve = '12months',
}

type CliffItem = {
  label: string
  value: string
}

const DEFAULT_CLIFF: CliffItem[] = [
  { label: '1 month', value: CLIFF_TIME.one_months },
  { label: '3 months', value: CLIFF_TIME.three_months },
  { label: '6 months', value: CLIFF_TIME.six_months },
  { label: '12 months', value: CLIFF_TIME.twelve },
]

const CliffTime = () => {
  const [nextCliffTime, setNextCliffTime] = useState('')
  const [cliffTime, setCliffTime] = useState(DEFAULT_CLIFF)
  const cliff = useSelector((state: AppState) => state.recipients.configs.cliff)
  const dispatch = useDispatch<AppDispatch>()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNextCliffTime(e.target.value)
  }

  const addCliffTime = (val?: string) => {
    if (val) return dispatch(setGlobalConfigs({ configs: { cliff: val } }))
    if (!parse(nextCliffTime)) return 'Wrong format!'
    const nextCliffTimes = [...cliffTime]
    const index = nextCliffTimes.findIndex(
      (item) => item.value === nextCliffTime,
    )
    if (index === -1)
      nextCliffTimes.push({ label: nextCliffTime, value: nextCliffTime })
    setCliffTime(nextCliffTimes)
    setNextCliffTime('')
    return dispatch(setGlobalConfigs({ configs: { cliff: nextCliffTime } }))
  }

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text className="caption">Cliff</Typography.Text>
      </Col>
      <Col span={24}>
        <Select
          className="select-vesting-data"
          placement="bottomRight"
          value={cliff}
          onChange={addCliffTime}
          dropdownRender={(menu) => (
            <>
              {menu}
              {!parse(nextCliffTime) && nextCliffTime && (
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
                value={nextCliffTime}
                suffix={
                  <Button
                    style={{ color: '#42E6EB' }}
                    onClick={() => addCliffTime()}
                    type="text"
                  >
                    Add
                  </Button>
                }
              />
            </>
          )}
        >
          {cliffTime.map(({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  )
}

export default CliffTime
