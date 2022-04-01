import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { Row, Col } from 'antd'
import BannerTop from './bannerTop'
import BannerBottom from './bannerBottom'
import AppCategorySeeAll from './appCategory/seeAll'
import AppCategorySlice from './appCategory/slice'

import { useRootSelector, RootState } from 'os/store'

const CATEGORIES = ['dapps', 'solana']

const Market = () => {
  const { search } = useLocation()
  const {
    page: { register },
  } = useRootSelector((state: RootState) => state)

  const tags = useMemo(() => {
    let tags: string[] = []
    for (const appId in register) {
      const newTags = register[appId]?.tags || []
      // Remove duplicate elements
      tags = Array.from(new Set([...tags, ...newTags]))
    }
    return CATEGORIES.filter((category) => tags.includes(category))
  }, [register])

  const category = new URLSearchParams(search).get('category')

  if (category) return <AppCategorySeeAll category={category} />
  return (
    <Row gutter={[16, 48]} justify="center">
      <Col span={24} className="sentre-col-container">
        <Row gutter={[16, 48]}>
          <Col span={24}>
            <BannerTop />
          </Col>
          {tags.map((tag) => (
            <Col span={24} key={tag}>
              <AppCategorySlice category={tag} />
            </Col>
          ))}
          <Col span={24}>
            <AppCategorySlice category="others" />
          </Col>
          <Col span={24}>
            <BannerBottom />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Market
