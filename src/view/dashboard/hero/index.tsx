import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWallet } from '@sentre/senhub'
import BN from 'bn.js'

import { Col, Row } from 'antd'
import HeroCard from './heroCard'
import IonIcon from '@sentre/antd-ionicon'
import Icon from '@ant-design/icons'

import useTotalUSD from 'hooks/useTotalUSD'
import { AppState } from 'model'
import { useCgk } from 'hooks/useCgk'

import { ReactComponent as ProfitIn } from 'static/images/profit_in.svg'
import { ReactComponent as ProfitOut } from 'static/images/profit_out.svg'

const Hero = () => {
  const [totalReceived, setTotalReceived] = useState(0)
  const [totalDistribution, setTotalDistribution] = useState(0)
  const { totalUSD } = useTotalUSD()
  const receipts = useSelector((state: AppState) => state.receipts)
  const distributors = useSelector((state: AppState) => state.distributors)
  const { getTotalBalance } = useCgk()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const fetchTotalReceived = useCallback(async () => {
    const listReceipt = Object.values(receipts)
    const mintBalances: { mint: string; amount: BN | bigint }[] = []
    if (!listReceipt.length) return setTotalReceived(0)
    for (const { amount, distributor } of listReceipt) {
      const address = distributor.toBase58()
      if (!distributors[address]) continue
      const { mint } = distributors[address]
      const mintBalance = { mint: mint.toBase58(), amount }
      mintBalances.push(mintBalance)
    }
    const total = await getTotalBalance(mintBalances)
    return setTotalReceived(total)
  }, [distributors, getTotalBalance, receipts])

  const fetchTotalDistribution = useCallback(async () => {
    const listDistributor = Object.values(distributors)
    const mintBalances: { mint: string; amount: BN | bigint }[] = []
    if (!listDistributor.length) return setTotalDistribution(0)
    for (const { total, mint, authority } of listDistributor) {
      if (walletAddress !== authority.toBase58()) continue
      const mintBalance = { mint: mint.toBase58(), amount: total }
      mintBalances.push(mintBalance)
    }
    const total = await getTotalBalance(mintBalances)
    return setTotalDistribution(total)
  }, [distributors, getTotalBalance, walletAddress])

  useEffect(() => {
    fetchTotalReceived()
  }, [fetchTotalReceived])

  useEffect(() => {
    fetchTotalDistribution()
  }, [fetchTotalDistribution])

  return (
    <Row gutter={[24, 24]}>
      <Col lg={8} md={12} xs={24}>
        <HeroCard
          label="Total balance"
          icon={<IonIcon className="card-hero-icon" name="wallet-outline" />}
          value={totalUSD}
          cardStyles={{ padding: '16px 24px' }}
        />
      </Col>
      <Col lg={8} md={12} xs={24}>
        <HeroCard
          label="Total distribution"
          icon={
            <Icon
              className="card-hero-icon"
              style={{ fontSize: 32 }}
              component={ProfitOut}
            />
          }
          value={totalDistribution}
          cardStyles={{ padding: '16px 24px' }}
        />
      </Col>
      <Col lg={8} md={12} xs={24}>
        <HeroCard
          label="Total received"
          icon={
            <Icon
              className="card-hero-icon"
              style={{ fontSize: 32 }}
              component={ProfitIn}
            />
          }
          value={totalReceived}
          cardStyles={{ padding: '16px 24px' }}
        />
      </Col>
    </Row>
  )
}

export default Hero
