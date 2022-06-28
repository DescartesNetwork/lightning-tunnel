import IonIcon from '@sentre/antd-ionicon'
import { Button } from 'antd'

type ActionEditButtonProps = {
  setIsEdit: (value: boolean) => void
  isEdit: boolean
  onSave: () => void
}
const ActionEditButton = ({
  setIsEdit,
  isEdit,
  onSave,
}: ActionEditButtonProps) => {
  if (!isEdit)
    return (
      <Button
        onClick={() => setIsEdit(true)}
        icon={<IonIcon name="create-outline" />}
        type="text"
        size="small"
      />
    )
  return (
    <Button
      type="text"
      size="small"
      style={{ padding: 0, color: '#42E6EB' }}
      onClick={onSave}
    >
      Save
    </Button>
  )
}

export default ActionEditButton
