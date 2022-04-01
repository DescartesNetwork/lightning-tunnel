import { MerkleDistributorInfo } from '@saberhq/merkle-distributor/dist/cjs/utils'

import { explorer } from 'shared/util'

export type DistributorInfo = {
  distributor: string
  distributorATA: string
}

export type ClaimProof = {
  index: number
  amount: string
  proof: any
  claimant: string
  distributorInfo?: DistributorInfo
  mintAddress: string
}

export type EncodeData = Record<string, ClaimProof>

export const notifySuccess = (content: string, txId: string) => {
  return window.notify({
    type: 'success',
    description: `${content} successfully. Click to view details.`,
    onClick: () => window.open(explorer(txId), '_blank'),
  })
}

export const notifyError = (er: any) => {
  return window.notify({
    type: 'error',
    description: er.message,
  })
}

export const generateCsv = (data: Record<string, any>[]) => {
  const titles: string[] = []
  // generate title
  for (const elm of data) {
    for (const key in elm) {
      if (!titles.includes(key)) titles.push(key)
    }
  }
  // generate row data
  const csvData = [titles]
  for (const elm of data) {
    const rowData = []
    for (const title of titles) {
      const val = String(elm[title]) || ''
      rowData.push(val)
    }
    csvData.push(rowData)
  }
  return {
    data: csvData,
    download: () => {
      let csvContent =
        'data:text/csv;charset=utf-8,' +
        csvData.map((e) => e.join(',')).join('\n')

      var encodedUri = encodeURI(csvContent)
      var link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute(
        'download',
        `sentre_cheques_${new Date().toString()}.csv`,
      )
      document.body.appendChild(link)
      link.click()
    },
  }
}

export const encodeData = (
  tree: MerkleDistributorInfo,
  distributorInfo: DistributorInfo,
  mintAddress: string,
): EncodeData => {
  if (!tree) return {}
  const { claims } = tree
  const data: EncodeData = {}
  const listClaimant = Object.keys(claims)
  listClaimant.forEach((claimant) => {
    const { amount, index, proof } = claims[claimant]
    const newClaim = {
      index,
      proof,
      amount: amount.toString(),
      claimant,
      distributorInfo,
      mintAddress,
    }
    data[claimant] = newClaim
  })
  return data
}
