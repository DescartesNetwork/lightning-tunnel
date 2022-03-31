import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { AppState } from 'app/model'
import { RecipientInfos } from 'app/model/recipients.controller'

const useTotal = () => {
  const {
    recipients: { recipients, errorData },
  } = useSelector((state: AppState) => state)

  const calculateTotal = (data: RecipientInfos) => {
    if (!data.length) return 0
    let sum = 0
    data.map((item) => {
      const amount = item[1]

      return (sum += Number(amount))
    })
    return sum
  }

  const editedSuccData =
    errorData?.filter((data) => {
      return !data.includes('') && account.isAddress(data[0])
    }) || []
  const recipientTotal = calculateTotal(recipients)
  const editedDataTotal = calculateTotal(editedSuccData)
  const total = recipientTotal + editedDataTotal
  const editedDataLength = editedSuccData?.length
  const quantity = useMemo(() => recipients.length, [recipients])

  return {
    total: BigInt(total),
    quantity: quantity + editedDataLength,
  }
}

export default useTotal
