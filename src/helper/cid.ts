import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'

const NULL = Buffer.from('00', 'hex')
const EXTENSION_LENGTH = 4
const CONTENT_LENGTH = 28

const decodeExtension = (cid: string) => {
  const buf = bs58.decode(cid)
  let ext = Buffer.from(
    buf.subarray(CONTENT_LENGTH, CONTENT_LENGTH + EXTENSION_LENGTH),
  ).toString('utf8')
  while (ext[0] === NULL.toString('utf8')) ext = ext.substring(1)
  return ext
}

export const toFilename = (cid: string) => {
  const extension = decodeExtension(cid)
  const content = Buffer.from(bs58.decode(cid).subarray(0, CONTENT_LENGTH))
  return `${bs58.encode(content)}.${extension}`
}

export type S3Info = {
  bucket: string
  region: string
}

export const toUrl = (cid: string, { bucket, region }: S3Info) => {
  const filename = toFilename(cid)
  return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`
}
