import { account } from '@senswap/sen-js'
import configs from 'app/configs'
import { createPDB } from 'shared/pdb'

const {
  manifest: { appId },
} = configs

export type HistoryRecord = {
  time: string
  mint: string
  total: string | number
  cid: string
}

class History {
  private db: LocalForage
  private key: string

  constructor(key: string, walletAddress: string) {
    if (!key) throw new Error('Invalid key')
    this.key = key
    if (!account.isAddress(walletAddress))
      throw new Error('Invalid wallet address')
    const db = createPDB(walletAddress, appId)
    if (!db) throw new Error('Invalid storage')
    this.db = db
  }

  set = async (history: HistoryRecord[]) => {
    return await this.db.setItem(this.key, history)
  }

  get = async (): Promise<HistoryRecord[]> => {
    return (await this.db.getItem(this.key)) || ([] as HistoryRecord[])
  }

  append = async (history: HistoryRecord) => {
    const prevHistory = await this.get()
    const nextHistory = [history, ...prevHistory]
    return this.set(nextHistory)
  }
}

export default History
