import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Button, Col, Row } from 'antd'
import DistributeIn from '../../../components/distributeIn'
import Frequency from '../../../components/frequency'
import UnlockTime from '../../../components/unlockTime'

import { AppDispatch, AppState } from 'app/model'
import { editRecipient } from 'app/model/recipientsV2.controller'

type EditDistributionConfigProps = {
  walletAddress: string
  setIsEdit: (value: boolean) => void
}

const EditDistributionConfig = ({
  walletAddress,
  setIsEdit,
}: EditDistributionConfigProps) => {
  const recipientInfos = useSelector(
    (state: AppState) => state.recipients.recipientInfos,
  )
  const globalConfigs = useSelector(
    (state: AppState) => state.recipients.globalConfigs,
  )
  const globalUnlockTime = useSelector(
    (state: AppState) => state.recipients.globalUnlockTime,
  )
  const dispatch = useDispatch<AppDispatch>()

  const unlockTime = useMemo(() => {
    if (!account.isAddress(walletAddress)) return globalUnlockTime
    return recipientInfos[walletAddress][0].unlockTime
  }, [globalUnlockTime, recipientInfos, walletAddress])

  const configs = useMemo(() => {
    if (!account.isAddress(walletAddress)) return globalConfigs
    const itemConfig = recipientInfos[walletAddress][0].configs
    if (!itemConfig) return globalConfigs
    return itemConfig
  }, [globalConfigs, recipientInfos, walletAddress])

  const [nextFrequency, setNextFrequency] = useState(configs.frequency)
  const [nextDistributeIn, setNextDistributeIn] = useState(configs.distributeIn)
  const [nextUnlockTime, setNextUnlockTime] = useState(unlockTime)

  const onSave = async () => {
    const nextConfigs = {
      frequency: nextFrequency,
      distributeIn: nextDistributeIn,
    }
    dispatch(
      editRecipient({
        walletAddress,
        configs: nextConfigs,
        unlockTime: nextUnlockTime,
      }),
    )
    return setIsEdit(false)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} md={7}>
        <UnlockTime unlockTime={nextUnlockTime} onChange={setNextUnlockTime} />
      </Col>
      <Col xs={12} md={7}>
        <Frequency frequency={nextFrequency} onChange={setNextFrequency} />
      </Col>
      <Col xs={12} md={7}>
        <DistributeIn
          distributeIn={nextDistributeIn}
          onChange={setNextDistributeIn}
        />
      </Col>
      <Col xs={12} md={3}>
        <Button onClick={onSave} type="text">
          save
        </Button>
      </Col>
    </Row>
  )
}

export default EditDistributionConfig
