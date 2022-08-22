import { useSelector } from 'react-redux'

import Auto from './auto'
import Manual from './manual'
import SelectInputMethod from './selectInputMethod'
import ConfirmTransfer from 'view/confirmTransfer'

import { AppState } from 'model'
import { Method, Step } from '../../../../constants'

const AirdropForm = () => {
  const {
    main: { methodSelected },
    steps: { step },
  } = useSelector((state: AppState) => state)

  if (step === Step.SelectMethod) return <SelectInputMethod />
  if (step === Step.AddRecipient)
    return methodSelected === Method.auto ? <Auto /> : <Manual />
  return <ConfirmTransfer />
}

export default AirdropForm
