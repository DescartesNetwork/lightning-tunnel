import { Steps } from 'antd'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'

const StepPriFi = () => {
  const {
    steps: { step },
  } = useSelector((state: AppState) => state)
  return (
    <Steps size="small" direction="vertical" current={step}>
      <Steps.Step description="Select a token" />
      <Steps.Step description="Fill in transfer information" />
      <Steps.Step description="Confirm transfer" />
    </Steps>
  )
}

export default StepPriFi
