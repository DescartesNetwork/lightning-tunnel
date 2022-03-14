import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'

const ADDRESS_IDX = 0
const EMAIL_IDX = 1

const useCanMerge = () => {
  const {
    recipients: { recipients },
    main: { selectedFile },
  } = useSelector((state: AppState) => state)

  const canMerge = useMemo(() => {
    if (!selectedFile.length || !recipients) return false

    let defaultData = recipients[selectedFile[0]]
    if (!defaultData) return false

    for (const idx of selectedFile) {
      if (
        !recipients[idx] ||
        recipients[idx][ADDRESS_IDX] !== defaultData[ADDRESS_IDX] ||
        recipients[idx][EMAIL_IDX] !== defaultData[EMAIL_IDX]
      )
        return false
    }
    return true
  }, [recipients, selectedFile])

  return canMerge
}

export default useCanMerge
