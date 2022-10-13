import { CSSProperties, Fragment, useState } from 'react'
import { useWidth, util } from '@sentre/senhub'

import { Button, Col, Modal, Row, Select, Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from '@sen-use/app'

import { ALL } from '../../constants'
import IonIcon from '@sentre/antd-ionicon'

type FieldOptionProps = { option: string }
const FieldOption = ({ option }: FieldOptionProps) => {
  if (util.isAddress(option))
    return (
      <Space>
        <MintAvatar mintAddress={option} />
        <MintSymbol mintAddress={option} />
      </Space>
    )
  return option
}

type SelectValues = Record<string, string>
type SelectionMobileProps = {
  onConfirm: (args: SelectValues) => void
  style?: CSSProperties
  options: Record<string, string[]>
  label?: string
  values?: SelectValues
}
const SelectionMobile = ({
  onConfirm,
  options,
  label = 'Filter by',
  values,
}: SelectionMobileProps) => {
  const [value, setValue] = useState<SelectValues>({})

  const onChange = (key: string, val: string) => {
    const nextValues = { ...values }
    nextValues[key] = val
    setValue(nextValues)
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Text type="secondary">{label}</Typography.Text>
      </Col>
      {Object.keys(options).map((key, idx) => {
        const option = options[key]
        return (
          <Col span={24} key={idx}>
            <Selection
              defaultValue={`All ${key}`}
              options={option}
              onChange={(val) => onChange(key, val)}
              style={{ width: '100%' }}
            />
          </Col>
        )
      })}
      <Col span={24}>
        <Button type="primary" onClick={() => onConfirm(value)} block>
          Confirm
        </Button>
      </Col>
    </Row>
  )
}

type SelectionProps = {
  onChange: (val: string) => void
  style?: CSSProperties
  options: string[]
  label?: string
  defaultValue?: string
  value?: string
}

const Selection = ({
  onChange,
  style,
  defaultValue = 'All token',
  options,
  value,
}: SelectionProps) => {
  return (
    <Select
      className="select-existed-token"
      style={{ minWidth: 150, width: '100%', ...style }}
      defaultValue={ALL}
      onChange={onChange}
      size="large"
      value={value}
    >
      <Select.Option value={ALL}>{defaultValue}</Select.Option>
      {options.map((option, idx) => (
        <Select.Option value={option} key={idx}>
          <FieldOption option={option.toString()} />
        </Select.Option>
      ))}
    </Select>
  )
}

type FilterSelectionProps = {
  onChange: (val: SelectValues) => void
  style?: CSSProperties
  defaultValue?: string
  options: Record<string, string[]>
  values?: SelectValues
}

const FilterSelection = ({
  onChange,
  style,
  options,
  values = {},
}: FilterSelectionProps) => {
  const [visible, setVisible] = useState(false)
  const width = useWidth()

  const isMobile = width < 875

  const onFilterChange = (key: string, val: string) => {
    const nextData = { ...values }
    nextData[key] = val
    onChange(nextData)
  }

  if (isMobile)
    return (
      <Fragment>
        <Button
          type="text"
          icon={<IonIcon name="funnel-outline" />}
          onClick={() => setVisible(true)}
        />

        <Modal
          visible={visible}
          onCancel={() => setVisible(false)}
          closable={false}
          footer={false}
          className="card-lightning"
        >
          <SelectionMobile
            onConfirm={(val) => {
              onChange(val)
              setVisible(false)
            }}
            options={options}
            values={values}
          />
        </Modal>
      </Fragment>
    )
  return (
    <Space>
      {Object.keys(options).map((key) => {
        const childOptions = options[key]
        return (
          <Selection
            style={style}
            defaultValue={`All ${key}`}
            options={childOptions}
            onChange={(val) => onFilterChange(key, val)}
            key={key}
          />
        )
      })}
    </Space>
  )
}

export default FilterSelection
