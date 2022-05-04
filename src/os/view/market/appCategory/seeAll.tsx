import { useHistory } from 'react-router'

import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import AppCard from '../appCard'

import { CategoryOptions, useAppCategory } from './hooks'

const CategorySeeAll = (options: CategoryOptions) => {
  const history = useHistory()
  const { title, appIds } = useAppCategory(options)

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Space>
          <Button
            type="text"
            icon={<IonIcon name="arrow-back-outline" />}
            onClick={() => history.push('/store')}
          />
          <Typography.Title level={2} style={{ textTransform: 'capitalize' }}>
            {title}
          </Typography.Title>
        </Space>
      </Col>
      {appIds.map((appId) => (
        <Col xs={24} sm={12} md={8} xl={6} key={appId}>
          <AppCard appId={appId} />
        </Col>
      ))}
    </Row>
  )
}

export default CategorySeeAll
