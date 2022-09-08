import { rpc } from '@sentre/senhub'
import { useCallback } from 'react'
import { web3 } from '@project-serum/anchor'
import { SolanaExplorer } from '@sen-use/web3'

import configs from 'configs'
import { ipfs, MetadataState } from 'model/metadatas.controller'

const TRANSACTION_SIZE = 50

export const useGetBackupMetadata = () => {
  const getBackupMetadata = useCallback(async (): Promise<MetadataState> => {
    // Fetch transactions
    const solanaExplorer = new SolanaExplorer(new web3.Connection(rpc))
    const transactions = await solanaExplorer.fetchTransactions(
      configs.sol.utility.program.programId.toBase58(),
      { limit: TRANSACTION_SIZE },
    )
    // Parse transactions
    let metadataBk: MetadataState
    let index = TRANSACTION_SIZE
    let instances = new Map<string, boolean>()
    let timeout: NodeJS.Timeout

    return new Promise(async (resolve) => {
      timeout = setTimeout(() => resolve(metadataBk || {}), 10000)
      transactions.map(async (transaction, i) => {
        try {
          const instructions = transaction.transaction.message.instructions
          for (const instruction of instructions) {
            const { parsed, program } = instruction as {
              parsed: string
              program: string
            }
            if (program !== 'spl-memo') continue
            // Check cid instance
            const cidString = parsed
            if (instances.has(cidString) || instances.size > 2) continue
            instances.set(cidString, true)
            // Fetch backup data
            let metadata = await ipfs.methods.backupMetadata.get(cidString)
            if (i === 0) {
              clearTimeout(timeout)
              resolve(metadata)
            } else if (i < index || !metadataBk) metadataBk = metadata
          }
        } catch (error) {
          // Nothing
        }
      })
    })
  }, [])

  return getBackupMetadata
}
