import { create, isIPFS, IPFS as IPFSType } from 'ipfs-core'
import { asyncWait } from 'shared/util'

const GET_CID_TIMEOUT = 5000

class IPFS {
  private _ipfs = async (): Promise<IPFSType> => {
    try {
      if (!window.ipfs) window.ipfs = await create()
      return window.ipfs
    } catch (er) {
      await asyncWait(500)
      return await this._ipfs()
    }
  }

  static isCID = (cid: string | undefined | null): boolean => {
    try {
      if (!cid) return false
      return isIPFS.multihash(cid)
    } catch (er) {
      return false
    }
  }

  get = async (cid: string) => {
    if (!IPFS.isCID(cid)) throw new Error('Invalid CID')
    const ipfs = await this._ipfs()
    const stream = await ipfs.cat(cid, { timeout: GET_CID_TIMEOUT })
    let raw = ''
    for await (const chunk of stream) raw += Buffer.from(chunk).toString()
    const data = JSON.parse(raw)
    return data
  }

  set = async (data: object): Promise<string> => {
    if (!data) throw new Error('Empty data')
    const raw = JSON.stringify(data)
    const ipfs = await this._ipfs()
    const { cid } = await ipfs.add(raw)
    return cid.toString()
  }
}

export default IPFS
