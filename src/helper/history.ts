import { account } from '@senswap/sen-js'
import configs from 'configs'
import { PDB } from '@sentre/senhub'

const {
  manifest: { appId },
} = configs

export type HistoryRecord = {
  time: number
  mint: string
  total: string | number
  distributorAddress: string
  treeData: Buffer
}

class History {
  private db: ReturnType<InstanceType<typeof PDB>['createInstance']>

  constructor(walletAddress: string) {
    if (!account.isAddress(walletAddress))
      throw new Error('Invalid wallet address')
    const db = new PDB(walletAddress).createInstance(appId)
    if (!db) throw new Error('Invalid storage')
    this.db = db
  }

  set = async (key: string, history: HistoryRecord) => {
    return await this.db.setItem(key, history)
  }

  get = async (key: string): Promise<HistoryRecord | HistoryRecord[]> => {
    return await this.db.getItem(key)
  }

  clear = async () => {
    return await this.db.clear()
  }
}

export default History
