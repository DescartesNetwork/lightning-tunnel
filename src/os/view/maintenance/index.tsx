import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Image, Row, Space, Typography } from 'antd'
import Brand from 'os/components/brand'

import bgMaintenance from 'os/static/images/maintenance/bg.png'

const SOCIALS = [
  { icon: 'globe', url: 'https://sentre.io' },
  { icon: 'logo-twitter', url: 'https://twitter.com/SentreProtocol' },
  { icon: 'logo-medium', url: 'https://sentre.medium.com' },
  { icon: 'logo-telegram', url: 'https://t.me/Sentre' },
  { icon: 'logo-discord', url: 'https://discord.com/invite/EXFntyCRzJ' },
]

const Maintenace = () => {
  return (
    <div
      className="loading-screen"
      style={{ paddingTop: 50, background: '#fff' }}
    >
      <Row gutter={[24, { xs: 24, lg: 32 }]}>
        <Col span={24}>
          <Row
            gutter={[24, { xs: 32, sm: 32, lg: 100 }]}
            align="middle"
            style={{ flexDirection: 'column' }}
          >
            <Col>
              <Brand style={{ maxWidth: 165 }} />
            </Col>
            <Col>
              <Image
                style={{ maxWidth: 350 }}
                src={bgMaintenance}
                preview={false}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row
            gutter={[24, { xs: 8, sm: 16, lg: 24 }]}
            align="middle"
            style={{ flexDirection: 'column', textAlign: 'center' }}
          >
            <Col>
              <Typography.Title
                level={1}
                style={{ color: '#F9575E', fontSize: 48 }}
              >
                Sorry! We are under maintenance
              </Typography.Title>
            </Col>
            <Col>
              <Typography.Text>
                SenHub is currently upgrading to make it even more useful to
                you.
                <br />
                Thank you for your patience.
              </Typography.Text>
            </Col>
            <Col>
              <Space>
                {SOCIALS.map((social, idx) => (
                  <Button
                    type="text"
                    style={{ color: '#7A7B85' }}
                    icon={<IonIcon name={social.icon} />}
                    onClick={() => window.open(social.url, '_blank')}
                    key={idx}
                  />
                ))}
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Maintenace
