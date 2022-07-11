import { Fragment, useCallback, useState } from 'react'

import { Button, Modal, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { ListMint, MintAvatar, MintSymbol } from 'shared/antd/mint'

export const EMPTY_SELECT_VAL = 'empty'

const SelectToken = ({
  activeMintAddress,
  onSelect,
}: {
  activeMintAddress: string
  onSelect: (mintAddress: string) => void
}) => {
  const [visible, setVisible] = useState(false)

  const onSelectMint = useCallback(
    (mintAddress: string) => {
      onSelect(mintAddress)
      setVisible(false)
    },
    [onSelect],
  )
  return (
    <Fragment>
      <Button
        className="select-token"
        type="text"
        onClick={() => setVisible(true)}
      >
        <Space>
          <MintAvatar mintAddress={activeMintAddress} />
          <MintSymbol mintAddress={activeMintAddress} />
          <IonIcon name="chevron-down-outline" />
        </Space>
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        closable={false}
        centered
        className="card-lightning mint-select-modal"
        destroyOnClose
      >
        <ListMint onChange={onSelectMint} />
      </Modal>
    </Fragment>
  )
}

export default SelectToken
