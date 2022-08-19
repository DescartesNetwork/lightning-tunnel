import { Fragment, useCallback, useEffect, useState } from 'react'
import { FeeOptions, Leaf, MerkleDistributor } from '@sentre/utility'
import { BN } from 'bn.js'

import { Button } from 'antd'

import { notifyError, notifySuccess } from 'helper'
import configs from 'configs'
import useStatus from 'hooks/useStatus'
import { useGetMetadata } from 'hooks/metadata/useGetMetadata'
import { State } from '../../../constants'

type ColumActionProps = {
  distributorAddress: string
  recipientData: Leaf
  receiptAddress: string
}
const {
  sol: { utility, taxman, fee },
} = configs

const ColumAction = ({
  distributorAddress,
  recipientData,
  receiptAddress,
}: ColumActionProps) => {
  const [merkle, setMerkle] = useState<MerkleDistributor>()
  const [loading, setLoading] = useState(false)
  const startedAt = recipientData.startedAt.toNumber()
  const { status } = useStatus({
    receipt: receiptAddress,
    startedAt,
    distributor: distributorAddress,
  })
  const getMetaData = useGetMetadata()

  const onClaim = async () => {
    if (!merkle) return
    const proof = merkle.deriveProof(recipientData)
    const validProof = merkle.verifyProof(proof, recipientData)
    if (!validProof) return

    try {
      setLoading(true)
      const feeOptions: FeeOptions = {
        fee: new BN(fee),
        feeCollectorAddress: taxman,
      }

      const { txId } = await utility.claim({
        distributorAddress,
        proof,
        data: recipientData,
        feeOptions,
      })
      notifySuccess('Redeem', txId)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  const getMerkleDistributor = useCallback(async () => {
    if (!distributorAddress) return
    try {
      const { data } = getMetaData(distributorAddress)
      const merkleDistributor = MerkleDistributor.fromBuffer(Buffer.from(data))

      return setMerkle(merkleDistributor)
    } catch (error) {
      notifyError(error)
    }
  }, [distributorAddress, getMetaData])

  useEffect(() => {
    getMerkleDistributor()
  }, [getMerkleDistributor])

  if (status && status === State.ready)
    return (
      <Button
        onClick={onClaim}
        loading={loading}
        type="text"
        className="btn-claim"
        style={{ color: '#42E6EB' }}
      >
        claim
      </Button>
    )

  return <Fragment />
}

export default ColumAction
