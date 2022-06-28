import { CSSProperties, Fragment, ReactNode, useState } from 'react'

import { Button, Card, Col, Collapse, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

type ExpandCardProps = {
  cardId: string
  children?: ReactNode
  cardHeader?: ReactNode
  style?: CSSProperties
}
const ExpandCard = ({
  cardId,
  children = <Fragment />,
  cardHeader = <Fragment />,
  style,
}: ExpandCardProps) => {
  const [activeKey, setActiveKey] = useState<string | undefined>()
  const iconName = activeKey ? 'chevron-up-outline' : 'chevron-down-outline'

  const onActive = () => {
    if (activeKey) return setActiveKey(undefined)
    return setActiveKey(cardId)
  }

  return (
    <Card
      bordered={false}
      bodyStyle={{ padding: '16px 0' }}
      style={{ ...style, background: 'unset', borderRadius: 0 }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>{cardHeader}</Col>
        <Col span={24}>
          <Row justify="center">
            <Col span={24} className="expand-card-collapse">
              <Collapse activeKey={activeKey} bordered={false}>
                <Collapse.Panel header={false} key={cardId} showArrow={false}>
                  {children}
                </Collapse.Panel>
              </Collapse>
            </Col>
            <Col>
              <Button
                type="text"
                size="small"
                icon={<IonIcon name={iconName} />}
                onClick={onActive}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default ExpandCard
