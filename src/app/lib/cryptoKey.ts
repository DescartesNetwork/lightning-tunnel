import { sign } from 'tweetnacl'

export const key = Buffer.from('6JsMB6PRrgvb847ZDkPMkJaiab826Ghy')

export const keyPair = sign.keyPair()

export type TransferData = {
  src: string
  des: string
  amount: string
  startDate: string
  endDate: string
  email: string
}

export type Cheque = {
  data: TransferData
  signature: string
}

const crypto_sign_BYTES = 64

export const signCheques = (data: TransferData[]) => {
  const listSig: Cheque[] = []
  for (let i = 0; i < data.length; i++) {
    const newData = Buffer.from(JSON.stringify(data[i]))
    const signedMsg = sign.detached(newData, keyPair.secretKey)
    let bufSig = new Uint8Array(crypto_sign_BYTES)
    for (let i = 0; i < bufSig.length; i++) bufSig[i] = signedMsg[i]
    const cheque: Cheque = {
      data: data[i],
      signature: Buffer.from(bufSig).toString('hex'),
    }
    listSig.push(cheque)
  }
  return listSig
}

export const verifyCheque = (data: TransferData, sig: string) => {
  const bufSig = Buffer.from(sig, 'hex')
  const newData = Buffer.from(JSON.stringify(data))
  const valid = sign.detached.verify(newData, bufSig, keyPair.publicKey)
  return valid
}
