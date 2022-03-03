import { Steps } from 'antd'

const StepPriFi = ({ step }: { step: number }) => {
  return (
    <Steps size="small" direction="vertical" current={step}>
      <Steps.Step description="Select a token" />
      <Steps.Step description="Fill in transfer information" />
      <Steps.Step description="Confirm transfer" />
    </Steps>
  )
}

export default StepPriFi
