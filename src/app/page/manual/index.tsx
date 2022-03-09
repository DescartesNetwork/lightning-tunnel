import { Fragment, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Row } from 'antd'
import Header from '../../components/header'
import InputInfoTransfer from '../../components/inputInfoTransfer'
import CardTotal from 'app/components/cardTotal'

import { AppDispatch, AppState } from 'app/model'
import { onSelectStep } from 'app/model/steps.controller'
import { onSelectMethod } from 'app/model/main.controller'
import { Step } from 'app/constants'
import { mergeRecipient } from 'app/model/recipients.controller'

const ActionButton = ({
  isSelect,
  setSelect,
  merge,
}: {
  merge: () => void
  isSelect: boolean
  setSelect: (value: boolean) => void
}) => {
  const {
    recipients: { recipients },
  } = useSelector((state: AppState) => state)
  return (
    <Fragment>
      {isSelect ? (
        <Row>
          <Col flex="auto">
            <Button onClick={merge} style={{ padding: 0 }} type="text">
              Merge
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => setSelect(false)}
              style={{ padding: 0 }}
              type="text"
            >
              Cancel
            </Button>
          </Col>
        </Row>
      ) : (
        recipients.length >= 2 && (
          <Button
            onClick={() => setSelect(true)}
            style={{ padding: 0 }}
            type="text"
          >
            Select
          </Button>
        )
      )}
    </Fragment>
  )
}

const Manual = () => {
  const [select, setSelect] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {
    recipients: { recipients },
  } = useSelector((state: AppState) => state)

  const onBack = useCallback(async () => {
    await dispatch(onSelectMethod())
    dispatch(onSelectStep(Step.zero))
  }, [dispatch])

  const merge = () => {
    const list = [0, 1]
    const ADDRESS_IDX = 0

    for (const idx of list) {
      if (recipients[idx][ADDRESS_IDX] !== recipients[list[0]][ADDRESS_IDX])
        return window.notify({
          type: 'error',
          description: "Can't merge different wallet addresses!",
        })
    }

    return dispatch(mergeRecipient({ listIndex: [0, 1] }))
  }

  return (
    <Card className="card-priFi" bordered={false}>
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Header label="Fill in recipient information" />
        </Col>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                {
                  <Col
                    span={24}
                    style={{ textAlign: !select ? 'right' : 'unset' }}
                  >
                    <ActionButton
                      merge={merge}
                      isSelect={select}
                      setSelect={setSelect}
                    />
                  </Col>
                }
                {recipients &&
                  recipients.map(([walletAddress, email, amount], index) => (
                    <Col span={24} key={walletAddress + index}>
                      <InputInfoTransfer
                        email={email}
                        amount={amount}
                        walletAddress={walletAddress}
                        index={index}
                        isSelect={select}
                      />
                    </Col>
                  ))}
                {!select && (
                  <Col span={24}>
                    <InputInfoTransfer />
                  </Col>
                )}
              </Row>
            </Col>
            <Col span={24}>
              <CardTotal />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Button onClick={onBack} size="large" type="ghost" block>
                Back
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                type="primary"
                onClick={() => dispatch(onSelectStep(Step.two))}
                block
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default Manual
