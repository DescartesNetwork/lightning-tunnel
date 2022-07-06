import { Fragment } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Button, Space } from 'antd'

type ActionButtonProps = {
  walletAddress?: string
  addNewRecipient: () => void
  remove: () => void
  isEdit?: boolean
  setIsEdit?: (value: boolean) => void
  disabled: boolean
}

const ActionButton = ({
  walletAddress,
  addNewRecipient,
  remove,
  isEdit = false,
  setIsEdit = () => {},
  disabled,
}: ActionButtonProps) => {
  return (
    <Fragment>
      {walletAddress ? (
        <Fragment>
          {!isEdit ? (
            <Space>
              <Button
                type="text"
                size="small"
                style={{ padding: 0 }}
                onClick={remove}
                icon={<IonIcon style={{ fonSize: 20 }} name="trash-outline" />}
              />
              <Button
                type="text"
                size="small"
                onClick={() => setIsEdit(true)}
                style={{ padding: 0 }}
                icon={<IonIcon style={{ fonSize: 20 }} name="create-outline" />}
              />
            </Space>
          ) : (
            <Button
              style={{ padding: 0, color: '#42E6EB' }}
              type="text"
              onClick={addNewRecipient}
              size="small"
              disabled={disabled}
            >
              Save
            </Button>
          )}
        </Fragment>
      ) : (
        <Button
          type="text"
          size="small"
          style={{ padding: 0, color: '#42E6EB' }}
          onClick={addNewRecipient}
        >
          OK
        </Button>
      )}
    </Fragment>
  )
}

export default ActionButton
