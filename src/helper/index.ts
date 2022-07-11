import { CID } from 'multiformats/cid'
import { util, DataLoader } from '@sentre/senhub'

export const notifySuccess = (content: string, txId: string) => {
  return window.notify({
    type: 'success',
    description: `${content} successfully. Click to view details.`,
    onClick: () => window.open(util.explorer(txId), '_blank'),
  })
}

export const notifyError = (er: any) => {
  return window.notify({
    type: 'error',
    description: er.message,
  })
}

export const getCID = (digest: number[]) => {
  const v0Prefix = new Uint8Array([18, 32])
  const v0Digest = new Uint8Array(v0Prefix.length + digest?.length)
  v0Digest.set(v0Prefix) // multicodec + length
  v0Digest.set(digest, v0Prefix.length)
  const cid = CID.decode(v0Digest)
  return cid.toString()
}

export const shortenTailText = (
  address: string,
  num = 4,
  delimiter = '...',
) => {
  return address.length > num ? address.substring(0, num) + delimiter : address
}

export const getFileCSV = async (fileCSV: string) => {
  return fetch(fileCSV).then(function (response) {
    let reader = response.body?.getReader()
    let decoder = new TextDecoder('utf-8')
    return reader?.read().then(function (result) {
      return decoder.decode(result.value)
    })
  })
}

export const fetchMulCGK = async (
  tickets: string[],
): Promise<{ [x: string]: number }> => {
  const ids = tickets.join(',')
  let url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
  const data = await DataLoader.load('fetchMulCGK' + ids, () =>
    fetch(url).then((res) => res.json()),
  )
  const result: { [x: string]: number } = {}
  for (const key in data) {
    result[key] = data[key].usd
  }
  return result
}
