import { useCallback, useEffect, useState } from 'react'
import { ReceiptData } from '@sentre/utility'

import configs from 'configs'

const {
  sol: { utility },
} = configs

const useReceipts = ({
  distributorAddress,
}: {
  distributorAddress: string
}) => {
  const [receipts, setReceipts] = useState<Record<string, ReceiptData>>({})
  const getReceipts = useCallback(async () => {
    const receipts = await utility.program.account.receipt.all([
      {
        memcmp: {
          offset: 40,
          bytes: distributorAddress,
        },
      },
    ])
    let bulk: Record<string, ReceiptData> = {}

    for (const receipt of receipts)
      bulk[receipt.account.authority.toBase58()] = receipt.account

    return setReceipts(bulk)
  }, [distributorAddress])

  useEffect(() => {
    getReceipts()
  }, [getReceipts])

  return receipts
}

export default useReceipts
