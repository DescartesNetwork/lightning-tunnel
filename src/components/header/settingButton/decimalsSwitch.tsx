import { useDispatch, useSelector } from 'react-redux'

import { Switch } from 'antd'

import { AppDispatch, AppState } from 'model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { setDecimal } from 'model/setting.controller'

const DecimalsSwitch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { mintSelected },
    setting: { decimal: isDecimal, disabled },
  } = useSelector((state: AppState) => state)
  const decimals = useMintDecimals(mintSelected) || 0

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
    />
  )
}

export default DecimalsSwitch
