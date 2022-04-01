import { useCallback, useEffect, useState } from 'react'
import { WalletInterface } from '@senswap/sen-js'
import { Provider, web3 } from '@project-serum/anchor'
import { MerkleDistributorSDK } from '@saberhq/merkle-distributor'
import { SolanaProvider } from '@saberhq/solana-contrib'

let merkleSDK: MerkleDistributorSDK | null = null

const useMerkleSDK = () => {
  const [sdk, setSdk] = useState<MerkleDistributorSDK | null>(null)

  const getAnchorProvider = useCallback(
    (
      node: string,
      walletAddress: string,
      wallet: WalletInterface,
    ): Provider => {
      const connection = new web3.Connection(node, 'confirmed')

      const signAllTransactions = async (transactions: web3.Transaction[]) => {
        const signedTransactions = []
        for (const transaction of transactions) {
          const signedTransaction = await wallet.signTransaction(transaction)
          signedTransactions.push(signedTransaction)
        }
        return signedTransactions
      }

      const publicKey = new web3.PublicKey(walletAddress)
      return new Provider(
        connection,
        {
          publicKey: new web3.PublicKey(publicKey),
          signTransaction: wallet.signTransaction,
          signAllTransactions,
        },
        {
          commitment: 'confirmed',
          skipPreflight: true,
        },
      )
    },
    [],
  )

  const createSDK = useCallback(async () => {
    const {
      sentre: { wallet, splt },
    } = window
    if (!wallet) return setSdk((merkleSDK = null))
    if (!merkleSDK) {
      const walletAddress = await wallet.getAddress()
      const anchorProvider = getAnchorProvider(
        splt.nodeUrl,
        walletAddress,
        wallet,
      )
      const provider = SolanaProvider.init({
        connection: anchorProvider.connection,
        wallet: anchorProvider.wallet,
        opts: anchorProvider.opts,
      })

      merkleSDK = MerkleDistributorSDK.load({ provider })
    }
    setSdk(merkleSDK)
  }, [getAnchorProvider])

  useEffect(() => {
    createSDK()
  }, [createSDK])

  return sdk
}

export default useMerkleSDK
