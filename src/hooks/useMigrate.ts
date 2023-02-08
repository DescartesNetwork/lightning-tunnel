import { AppState } from 'model'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useUploadFile } from './action/useUploadFile'
import { useGetMetadata } from './metadata/useTmp'

export const useMigrate = () => {
  const distributors = useSelector((state: AppState) => state.distributors)
  const getMetaData = useGetMetadata()
  const uploadToAWS = useUploadFile()
  const [loading, setLoading] = useState(false)

  const onBackup = useCallback(async () => {
    const result: Record<string, string> = {}

    try {
      setLoading(true)
      for (const address in distributors) {
        const { data } = await getMetaData(address)
        const blob = [
          new Blob([JSON.stringify({ data }, null, 2)], {
            type: 'application/json',
          }),
        ]
        const file = new File(blob, 'metadata.txt')
        const cid = await uploadToAWS(file)
        result[address] = cid
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

    console.log(result)
  }, [distributors, getMetaData, uploadToAWS])

  return { onBackup, loading }
}
