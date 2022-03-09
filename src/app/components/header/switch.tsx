import { useDispatch, useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { Switch } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { addRecipients, RecipientInfos } from 'app/model/recipients.controller'
import { toBigInt } from 'app/shared/utils'
import { setDecimal } from 'app/model/setting.controller'

const SwitchDecimal = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { mintSelected },
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  const decimals = useMintDecimals(mintSelected) || 0

  const onSwitch = async (checked: boolean) => {
    const nextData: RecipientInfos = recipients.map(
      ([address, email, amount]) => {
        const newAmount = checked
          ? utils.decimalize(amount, decimals).toString()
          : utils.undecimalize(toBigInt(amount), decimals)
        return [address, email, newAmount]
      },
    )
    await dispatch(setDecimal(checked))
    await dispatch(addRecipients({ recipients: nextData }))
  }

  return (
    <Switch
      onChange={onSwitch}
      checkedChildren={decimals}
      unCheckedChildren={decimals}
      disabled={!decimals}
    />
  )
}

export default SwitchDecimal
