import { Transaction, PublicKey } from '@solana/web3.js'
import { AnchorWallet } from '@sentre/utility'
import { WalletInterface } from '@senswap/sen-js'

class SafeWallet implements AnchorWallet {
  private _wallet: WalletInterface = window.sentre.solana
  private _publicKey: PublicKey = new PublicKey(
    'GuestAccount11111111111111111111111111111111',
  )

  constructor() {
    this._init()
  }

  private _init = async () => {
    const address = await this._wallet.getAddress()
    this._publicKey = new PublicKey(address)
  }

  signTransaction = async (tx: Transaction): Promise<Transaction> => {
    return this._wallet.signTransaction(tx)
  }

  signAllTransactions = async (txs: Transaction[]): Promise<Transaction[]> => {
    let signedTxs: Transaction[] = []
    for (const tx of txs) {
      const signedTx = await this.signTransaction(tx)
      signedTxs.push(signedTx)
    }
    return signedTxs
  }

  get publicKey() {
    return this._publicKey
  }
}

export default SafeWallet
