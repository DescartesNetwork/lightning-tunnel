import { ChangeEvent, Fragment, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Input, Row, Select, Typography } from 'antd'

import { AppDispatch, AppState } from 'model'
import { setGlobalConfigs } from 'model/recipients.controller'
import parse from 'parse-duration'

export enum DISTRIBUTE_IN_TIME {
  six_months = '6months',
  one_year = '1y',
  tow_years = '2y',
  four_years = '4y',
}

type DistributeInItem = {
  label: string
  value: string
}

const DISTRIBUTE_IN: DistributeInItem[] = [
  { label: '6 months', value: DISTRIBUTE_IN_TIME.six_months },
  { label: '1 year', value: DISTRIBUTE_IN_TIME.one_year },
  { label: '2 years', value: DISTRIBUTE_IN_TIME.tow_years },
  { label: '4 years', value: DISTRIBUTE_IN_TIME.four_years },
]

const DistributeIn = () => {
  const [nextDistributeIn, setNextDistributeIn] = useState('')
  const [listTime, setListTime] = useState(DISTRIBUTE_IN)
  const expirationTime = useSelector(
    (state: AppState) => state.recipients.expirationTime,
  )
  const unlockTime = useSelector(
    (state: AppState) => state.recipients.globalUnlockTime,
  )
  const distributeIn = useSelector(
    (state: AppState) => state.recipients.configs.distributeIn,
  )
  const frequency = useSelector(
    (state: AppState) => state.recipients.configs.frequency,
  )
  const dispatch = useDispatch<AppDispatch>()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNextDistributeIn(e.target.value)
  }

  const addDistributeIn = (val?: string) => {
    if (val)
      return dispatch(setGlobalConfigs({ configs: { distributeIn: val } }))
    if (!parse(nextDistributeIn)) return
    const nextListTime = [...listTime]
    const index = nextListTime.findIndex(
      (item) => item.value === nextDistributeIn,
    )
    if (index === -1)
      nextListTime.push({ label: nextDistributeIn, value: nextDistributeIn })
    setListTime(nextListTime)
    setNextDistributeIn('')
    return dispatch(
      setGlobalConfigs({ configs: { distributeIn: nextDistributeIn } }),
    )
  }

  const error = useMemo(() => {
    const time = unlockTime + parse(distributeIn)
    if (expirationTime < time && expirationTime)
      return 'Must be less than the expiration time.'
    if (parse(distributeIn) < parse(frequency))
      return 'Must be greater than the distribution frequency.'
    return ''
  }, [distributeIn, expirationTime, frequency, unlockTime])

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text className="caption">Distribute in</Typography.Text>
      </Col>
      <Col span={24}>
        <Select
          className="select-vesting-data"
          value={distributeIn}
          onChange={addDistributeIn}
          placement="bottomRight"
          dropdownRender={(menu) => (
            <>
              {menu}
              {!parse(nextDistributeIn) && nextDistributeIn && (
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
                value={nextDistributeIn}
                suffix={
                  <Button
                    style={{ color: '#42E6EB' }}
                    onClick={() => addDistributeIn()}
                    type="text"
                  >
                    Add
                  </Button>
                }
              />
            </>
          )}
        >
          {listTime.map(({ label, value }, index) => (
            <Select.Option key={index} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Col>
      {error && (
        <Col span={24}>
          <Typography.Text style={{ color: '#F9575E' }} className="caption">
            {error}
          </Typography.Text>
        </Col>
      )}
    </Row>
  )
}

export default DistributeIn
