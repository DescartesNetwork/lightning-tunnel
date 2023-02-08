import { useCallback } from 'react'
import axios from 'axios'

import configs from 'configs'

export const useUploadFile = () => {
  const uploadToAWS = useCallback(async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await axios.post(configs.api.senApiUpload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })
    return data.cid
  }, [])

  return uploadToAWS
}
