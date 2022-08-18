import { IPFS } from '@sen-use/app'

const KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU4M0Q5MmIwMGJlNjZDNjg2NDUyY0JkNTZEMTlmOWZlMTRhNjhCYTQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTg4MDM1NjE3MTcsIm5hbWUiOiJCb29zdGVyRGV2In0.kaP_EXFB2q7Zo8_CWZfGI1n5R-AoZzfVTWpDdZ_REcM'

type MapTypes = {
  treeData: Buffer
}
type Idl = ['treeData']
const IDL: Idl = ['treeData']

export const ipfs = new IPFS<MapTypes, Idl>(KEY, IDL)
