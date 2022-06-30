import { account } from '@senswap/sen-js'
import configs from 'configs'
import { createPDB } from '@sentre/senhub'
import LocalForage from 'localforage'

const {
  manifest: { appId },
} = configs

export type HistoryRecord = {
  time: string
  mint: string
  total: string | number
  distributorAddress: string
  treeData: Buffer
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

  update = async (historyRecord: HistoryRecord) => {
    const prevHistory = await this.get()
    const index = prevHistory.findIndex(
      (history) =>
        history.distributorAddress === historyRecord.distributorAddress,
    )
    prevHistory[index] = historyRecord
    return this.set(prevHistory)
  }

  append = async (history: HistoryRecord) => {
    const prevHistory = await this.get()
    const nextHistory = [history, ...prevHistory]
    return this.set(nextHistory)
  }
}

export default History
