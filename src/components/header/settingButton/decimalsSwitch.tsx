import { useDispatch, useSelector } from 'react-redux'
import { useMintDecimals } from '@sentre/senhub'

import { Switch } from 'antd'

import { AppDispatch, AppState } from 'model'
import { setDecimal } from 'model/setting.controller'

const DecimalsSwitch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { mintSelected },
    setting: { decimal: isDecimal, disabled },
  } = useSelector((state: AppState) => state)
  const decimals = useMintDecimals({ mintAddress: mintSelected }) || 0

  const onSwitch = (checked: boolean) => {
    dispatch(setDecimal(checked))
  }

  return (
    <Switch
      className="decimal-switch"
      onChange={onSwitch}
      checkedChildren={decimals}
      unCheckedChildren={decimals}
      disabled={disabled}
      checked={isDecimal}
      size="small"
    />
  )
}

export default DecimalsSwitch
