import { useUI } from '@senhub/providers'
import { Steps } from 'antd'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'

const StepPriFi = () => {
  const {
    steps: { step },
  } = useSelector((state: AppState) => state)
  const {
    ui: { width },
  } = useUI()

  const direction = width < 992 ? 'horizontal' : 'vertical'

  return (
    <Steps size="small" direction={direction} current={step} responsive={false}>
      <Steps.Step description="Select a token" />
      <Steps.Step description="Fill in transfer information" />
      <Steps.Step description="Confirm transfer" />
    </Steps>
  )
}

export default StepPriFi
