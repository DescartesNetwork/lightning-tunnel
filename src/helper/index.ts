import { util, DataLoader } from '@sentre/senhub'

export const notifySuccess = (content: string, txId: string) => {
  return window.notify({
    type: 'success',
    description: `${content} successfully. Click to view details.`,
    onClick: () => window.open(util.explorer(txId), '_blank'),
  })
}

export const notifyError = (er: any) => {
  console.log('er', er)
  return window.notify({
    type: 'error',
    description: er.message,
  })
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

export const toUnitTime = (time: number) => {
  const unitDate = new Date(time).toUTCString()
  const unitTime = new Date(unitDate).getTime()
  return unitTime
}
