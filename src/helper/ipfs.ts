import { File, Web3Storage } from 'web3.storage'
import localforage from 'localforage'
import axios from 'axios'

import { CID } from 'multiformats/cid'
import { DataLoader } from '@sen-use/web3'

var store = localforage.createInstance({
  name: 'cache-ipfs',
  storeName: 'cache-ipfs',
})

const CLUSTER = [
  'https://cloudflare-ipfs.com/ipfs/{CID_STRING}/file',
  'https://ipfs.rove.to/ipfs/{CID_STRING}/file',
  'https://{CID_STRING}.ipfs.nftstorage.link/file',
  'https://{CID_STRING}.ipfs.4everland.io/file',
  'https://gateway.ipfs.io/ipfs/{CID_STRING}/file',
  'https://{CID_STRING}.ipfs.cf-ipfs.com/file',
]

export class IPFS<
  MapTypes extends Record<string, any>,
  T extends Array<keyof MapTypes>,
> {
  private provider: Web3Storage
  constructor(
    private key: string,
    private IDL: T,
    private endpoint = 'https://api.web3.storage',
  ) {
    this.provider = new Web3Storage({
      endpoint: new URL(this.endpoint),
      token: this.key,
    })
  }

  decodeCID = (digest: string | Buffer | Uint8Array | number[]) => {
    if (typeof digest === 'string') return digest
    const v0Prefix = new Uint8Array([18, 32])
    const v0Digest = new Uint8Array(v0Prefix.length + digest?.length)
    v0Digest.set(v0Prefix) // multicodec + length
    v0Digest.set(digest, v0Prefix.length)
    const cid = CID.decode(v0Digest)
    return cid.toString()
  }

  get methods() {
    const methods: {
      [x in T[number]]: {
        get: (
          digest: string | Buffer | Uint8Array | number[],
        ) => Promise<MapTypes[x]>
        set: (data: MapTypes[x]) => Promise<{ cid: string; digest: Uint8Array }>
      }
    } = {} as any
    for (const elm of this.IDL) {
      methods[elm] = {
        set: (data) => this.set(data),
        get: (digest) => this.get(digest),
      }
    }
    return methods
  }

  private async set(data: any, cache = true): Promise<any> {
    const file = new File([JSON.stringify(data)], 'file', {
      type: 'application/json',
    })
    const cid = await this.provider.put([file])
    const {
      multihash: { digest },
    } = CID.parse(cid)
    // Save IPFS to cache
    return new Promise((resolve) => {
      let timeout = setTimeout(() => this.set(data), 5000)
      this.get(cid).then(async (data) => {
        if (data) {
          clearTimeout(timeout)
          await store.setItem(this.decodeCID(digest), { data, checked: true })
          resolve({ cid, digest })
        }
      })
    })
  }

  private async get(
    digest: string | Buffer | Uint8Array | number[],
    cache = true,
  ): Promise<any> {
    const cid = this.decodeCID(digest)
    return DataLoader.load(`ipfs:${cid}`, async () => {
      return new Promise((resolve, reject) => {
        let instance = setTimeout(async () => {
          // Resolve promise function
          async function resolveData(data: any) {
            try {
              await store.setItem(cid, { data, checked: true })
            } catch (error) {
              console.log('ipfs set cache error:', error)
            }
            resolve(data)
            clearTimeout(instance)
          }
          // Cache
          if (cache) {
            const cacheData = await store.getItem<any>(cid)
            if (!!cacheData) return resolveData(cacheData.data)
          }
          // API support
          for (const url of CLUSTER) {
            if (!cid.startsWith('baf')) continue
            try {
              axios
                .get(url.replace('{CID_STRING}', cid), {
                  headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                  },
                })
                .then((data) => {
                  if (!!data.data) resolveData(data.data)
                })
            } catch (error) {}
          }
          // Web3 store get
          const re = await this.provider.get(cid)
          const file = ((await re?.files()) || [])[0]
          const reader = new FileReader()
          try {
            if (!file) throw new Error('Cannot read empty file')
            reader.onload = async () => {
              const contents = reader.result?.toString()
              if (!contents) throw new Error('Cannot read empty file')
              const ipfsData = JSON.parse(contents)
              // Set status cache data
              return resolveData(ipfsData)
            }
            reader.readAsText(file)
          } catch (er: any) {
            return reject(er.message)
          }
        })
      })
    })
  }
}
