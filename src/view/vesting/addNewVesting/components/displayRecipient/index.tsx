import { Col, Row, Typography } from 'antd'
import RecipientCard from './recipientCard'
import Header from './header'

import useFilteredVestingRecipient from 'hooks/vesting/useFilteredVestingRecipients'
import { RecipientFileType } from '../../../../.././constants'
import { Fragment } from 'react'

const DisplayRecipient = () => {
  const listVesting = useFilteredVestingRecipient({
    type: RecipientFileType.valid,
  })

  return (
    <Row className="display-recipient" justify="center">
      {listVesting.length ? (
        <Fragment>
          <Col span={24}>
            <Header />
          </Col>
          {listVesting.map((vestingItem, index) => (
            <Col span={24} key={vestingItem.address}>
              <RecipientCard vestingItem={vestingItem} index={index} />
            </Col>
          ))}
        </Fragment>
      ) : (
        <Col>
          <Typography.Text>Please input recipient information</Typography.Text>
        </Col>
      )}
    </Row>
  )
}

export default DisplayRecipient
