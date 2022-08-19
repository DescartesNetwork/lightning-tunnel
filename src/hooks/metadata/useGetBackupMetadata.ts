import { rpc } from '@sentre/senhub'
import { useCallback } from 'react'
import { web3 } from '@project-serum/anchor'
import { SolanaExplorer } from '@sen-use/web3'

import configs from 'configs'
import { ipfs } from 'model/metadatas.controller'

export const useGetBackupMetadata = () => {
  const getBackupMetadata = useCallback(async () => {
    // Fetch transactions
    const solanaExplorer = new SolanaExplorer(new web3.Connection(rpc))
    const transactions = await solanaExplorer.fetchTransactions(
      configs.sol.utility.program.programId.toBase58(),
      { limit: 100 },
    )
    // Parse transactions
    for (const transaction of transactions) {
      const instructions = transaction.transaction.message.instructions
      for (const instruction of instructions) {
        const { parsed, program } = instruction as {
          parsed: string
          program: string
        }
        if (program !== 'spl-memo') continue
        try {
          const backupMetadata = await ipfs.methods.backupMetadata.get(parsed)
          // TODO: verify metadata
          return backupMetadata
        } catch (error) {}
      }
    }
    return {}
  }, [])

  return getBackupMetadata
}
