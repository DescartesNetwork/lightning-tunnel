import { Button, Col, Image, Row, Space, Typography } from 'antd'
import Brand from 'os/components/brand'

import bgMaintenance from 'os/static/images/maintenance/bg.png'
import icoDiscord from 'os/static/images/maintenance/discord.svg'
import icoTele from 'os/static/images/maintenance/tele.svg'
import icoMedium from 'os/static/images/maintenance/medium.svg'
import icoTwitter from 'os/static/images/maintenance/twitter.svg'
import icoWeb from 'os/static/images/maintenance/web.svg'

const SOCIALS = [
  { icon: icoWeb, url: 'https://sentre.io' },
  { icon: icoTwitter, url: 'https://twitter.com/SentreProtocol' },
  { icon: icoMedium, url: 'https://sentre.medium.com' },
  { icon: icoTele, url: 'https://t.me/Sentre' },
  { icon: icoDiscord, url: 'https://discord.com/invite/EXFntyCRzJ' },
]

const Maintenace = () => {
  return (
    <Row gutter={[32, 32]}>
      <Col span={24}>
        <Row
          gutter={[100, 100]}
          align="middle"
          style={{ flexDirection: 'column' }}
        >
          <Col>
            <Brand style={{ maxWidth: 165 }} />
          </Col>
          <Col>
            <Image
              style={{ maxWidth: 500 }}
              src={bgMaintenance}
              preview={false}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row
          gutter={[24, 24]}
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
              SenHub are currently upgrading to make it even more useful to you.
              <br />
              Thank you for your patience.
            </Typography.Text>
          </Col>
          <Col>
            <Space>
              {SOCIALS.map((social, idx) => (
                <Button
                  type="text"
                  icon={<Image src={social.icon} preview={false} />}
                  onClick={() => window.open(social.url, '_blank')}
                  key={idx}
                />
              ))}
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Maintenace
