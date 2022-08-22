import { rpc } from '@sentre/senhub'
import { useCallback } from 'react'
import { web3 } from '@project-serum/anchor'
import { SolanaExplorer } from '@sen-use/web3'

import configs from 'configs'
import { ipfs, MetadataState } from 'model/metadatas.controller'

export const useGetBackupMetadata = () => {
  const getBackupMetadata = useCallback(async (): Promise<MetadataState> => {
    // Fetch transactions
    const solanaExplorer = new SolanaExplorer(new web3.Connection(rpc))
    const transactions = await solanaExplorer.fetchTransactions(
      configs.sol.utility.program.programId.toBase58(),
      { limit: 100 },
    )
    // Parse transactions
    for (const transaction of transactions) {
      try {
        const instructions = transaction.transaction.message.instructions
        for (const instruction of instructions) {
          const { parsed, program } = instruction as {
            parsed: string
            program: string
          }
          if (program !== 'spl-memo') continue
          return new Promise(async (resolve) => {
            // Rove IPFS
            try {
              fetch(
                'https://ipfs.rove.to/ipfs/bafybeig5driamixotu35mnjainl5twntjdpj4ff7hl4os3ou4nolhewfdy/file',
              ).then((data) => data.json().then((val) => resolve(val)))
            } catch (error) {}
            // Web3 IPFS
            ipfs.methods.backupMetadata
              .get(parsed)
              .then((data) => resolve(data))
            // TODO: another IPFS
            // ...
          })
        }
      } catch (error) {
        // Nothing
      }
    }
    return {}
  }, [])

  return getBackupMetadata
}
