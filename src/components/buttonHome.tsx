import { Button } from 'antd'

const ButtonHome = ({ onBack }: { onBack: () => void }) => {
  return (
    <Button size="large" type="primary" block onClick={onBack}>
      Home
    </Button>
  )
}

export default ButtonHome
