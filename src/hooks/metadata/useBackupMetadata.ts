import { useWalletAddress } from '@sentre/senhub'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@project-serum/anchor'

import { getMetadatas, ipfs } from 'model/metadatas.controller'
import { AppDispatch } from 'model'

const MEMO_PROGRAMS = 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'

export const useBackupMetadata = () => {
  const dispatch = useDispatch<AppDispatch>()
  const walletAddress = useWalletAddress()

  const backupMetadata = useCallback(async () => {
    const metadatas = await dispatch(getMetadatas()).unwrap()
    const { cid } = await ipfs.methods.backupMetadata.set(metadatas)

    const ix = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: new web3.PublicKey(walletAddress),
          isSigner: true,
          isWritable: true,
        },
      ],
      programId: new web3.PublicKey(MEMO_PROGRAMS),
      data: Buffer.from(cid),
    })
    return ix
  }, [dispatch, walletAddress])

  return backupMetadata
}
