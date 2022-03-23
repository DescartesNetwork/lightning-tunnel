import { ReactNode } from 'react'
import CryptoJS from 'crypto-js'
import { MerkleDistributorInfo } from '@saberhq/merkle-distributor/dist/cjs/utils'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'

import { explorer } from 'shared/util'

type GmailMessage = {
  from: string
  to: string[]
  subject: string
  message: string | ReactNode
}

export type DistributorInfo = {
  distributor: string
  distributorATA: string
}

export type ClaimProof = {
  index: number
  amount: string
  proof: any
  clamaint: string
  distributorInfo?: DistributorInfo
}

type EncodeData = Record<string, string>

export const onSendMessage = async (args: GmailMessage) => {
  const { from, to, subject, message } = args
  const msg =
    `From: ${from}\r\n` +
    `To: ${to.toString()}\r\n` +
    'Content-Type: text/html; charset=utf-8\r\n' +
    `Subject: ${subject}\r\n\r\n` +
    message

  // The body needs to be base64url encoded.
  const encodedMessage = window.btoa(msg)

  const reallyEncodedMessage = encodedMessage
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  const rsSendMsg = await window.gapi.client.gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: reallyEncodedMessage,
    },
  })
  return rsSendMsg
}

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

export const encryptKey = (walletAddress: string, data: any) => {
  const encJson = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    walletAddress,
  ).toString()
  const encryptKey = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encJson),
  )
  return encryptKey
}

export const decryptKey = (walletAddress: string, encryptData: string) => {
  try {
    const decData = CryptoJS.enc.Base64.parse(encryptData).toString(
      CryptoJS.enc.Utf8,
    )
    const bytes = CryptoJS.AES.decrypt(decData, walletAddress).toString(
      CryptoJS.enc.Utf8,
    )
    return JSON.parse(bytes)
  } catch (error) {
    console.log(error)
  }
}

export const encodeData = (
  tree: MerkleDistributorInfo,
  distributorInfo: DistributorInfo,
): EncodeData => {
  if (!tree) return {}
  const { claims } = tree
  const data: EncodeData = {}
  const listClamaint = Object.keys(claims)
  listClamaint.forEach((clamaint) => {
    const { amount, index, proof } = claims[clamaint]
    const newClaim = {
      index,
      proof,
      amount: amount.toString(),
      clamaint,
      distributorInfo,
    }
    const encyptD = bs58.encode(new Buffer(JSON.stringify(newClaim)))
    data[clamaint] = encyptD
  })
  return data
}

export const decodeData = (data: string): ClaimProof => {
  const bufData = bs58.decode(data)
  return JSON.parse(new Buffer(bufData).toString())
}
