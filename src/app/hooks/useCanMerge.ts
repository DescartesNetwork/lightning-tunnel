import { AppState } from 'app/model'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const ADDRESS_IDX = 0
const EMAIL_IDX = 1

const useCanMerge = () => {
  const [canMerge, setCanMerge] = useState(false)
  const {
    recipients: { recipients },
    main: { selectedFile },
  } = useSelector((state: AppState) => state)

  const checkCanMerge = useCallback(() => {
    if (!selectedFile?.length || !recipients.length) return
    for (const idx of selectedFile) {
      if (
        recipients[idx][ADDRESS_IDX] !==
          recipients[selectedFile[0]][ADDRESS_IDX] ||
        recipients[idx][EMAIL_IDX] !== recipients[selectedFile[0]][EMAIL_IDX]
      )
        return setCanMerge(false)
    }
    return setCanMerge(true)
  }, [recipients, selectedFile])

  useEffect(() => {
    checkCanMerge()
  }, [checkCanMerge])

  return canMerge
}

export default useCanMerge
