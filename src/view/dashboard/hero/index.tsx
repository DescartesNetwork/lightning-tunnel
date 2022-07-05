import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import BN from 'bn.js'

import { Col, Row, Spin } from 'antd'
import HeroCard from './heroCard'

import useTotalUSD from 'hooks/useTotalUSD'
import { AppState } from 'model'
import { useCgk } from 'hooks/useCgk'

const Hero = () => {
  const [totalReceived, setTotalReceived] = useState(0)
  const { totalUSD, loading } = useTotalUSD()
  const listReceived = useSelector((state: AppState) => state.listReceived)
  const receipts = useSelector((state: AppState) => state.receipts)
  const distributors = useSelector((state: AppState) => state.distributors)
  const { getTotalBalance } = useCgk()

  const fetchTotalReceived = useCallback(async () => {
    const listReceipt = Object.values(receipts)
    const mintBalances: { mint: string; amount: BN | bigint }[] = []
    if (!listReceipt.length) return setTotalReceived(0)
    for (const { amount, distributor } of listReceipt) {
      const address = distributor.toBase58()
      const { mint } = distributors[address]
      const mintBalance = { mint: mint.toBase58(), amount }
      mintBalances.push(mintBalance)
    }
    const total = await getTotalBalance(mintBalances)
    return setTotalReceived(total)
  }, [distributors, getTotalBalance, receipts])

  useEffect(() => {
    fetchTotalReceived()
  }, [fetchTotalReceived])

  return (
    <Row gutter={[24, 24]}>
      <Col lg={8} md={12} xs={24}>
        <Spin spinning={loading}>
          <HeroCard
            label="Total balance"
            icon="wallet-outline"
            value={totalUSD}
          />
        </Spin>
      </Col>
      <Col lg={8} md={12} xs={24}>
        <HeroCard
          label="Total distribution"
          icon="log-out-outline"
          value={Object.keys(listReceived).length}
        />
      </Col>
      <Col lg={8} md={12} xs={24}>
        <HeroCard
          label="Total received"
          icon="log-in-outline"
          value={totalReceived}
        />
      </Col>
    </Row>
  )
}

export default Hero
