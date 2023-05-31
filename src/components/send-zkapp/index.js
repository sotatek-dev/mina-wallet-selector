/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Input, Col, Row, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { WALLET } from '../../services/multipleWallet'
import { useAppSelector } from '../../hooks/redux'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../src/styles.css'

const SendZkapp = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [sendMessageResult, setSendMessageResult] = useState('')
  const [, forceUpdate] = useState({})
  const [loadingGetStateZkap, setLoadingGetStateZkap] = useState(false)
  const { zkAppAddress } = props

  const { isInstalledWallet, connected } = useAppSelector(
    (state) => state.wallet
  )

  useEffect(() => {
    forceUpdate({})
  }, [])

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const getStateZkapp = async () => {
    if (!connected) return setSendMessageResult('Please connect wallet!')
    setSendMessageResult('')
    setLoadingGetStateZkap(true)
    const zkState = await getzkState(zkAppAddress)
    setLoadingGetStateZkap(false)
    setSendMessageResult(zkState)
  }

  const sendButton = async () => {
    const wallet = localStorage.getItem('wallet')
    if (!connected) return setSendMessageResult('Please connect wallet!')
    setSendMessageResult('')
    try {
      setLoading(true)
      const values = await form.validateFields()
      const answer = values.answer?.trim()
      const fee = 0.01
      // const fee = values.sendFee2 ? values.sendFee2 : values.sendFee
      const zkBody = await getZkbody(answer, zkAppAddress)
      if (zkBody?.error) {
        setLoading(false)
        setSendMessageResult(JSON.stringify(zkBody))
      } else {
        if (wallet === 'Auro') {
          try {
            const result = await WALLET.Auro.methods.SendTransactionZkApp({
              transaction: zkBody.partiesJsonUpdate,
              feePayer: {
                memo: '',
                fee: fee
              }
            })
            if (result) {
              setLoading(false)
              setSendMessageResult(JSON.stringify(result))
            }
          } catch (error) {
            setLoading(false)
            console.log(error)
            setSendMessageResult(JSON.stringify(error))
          }
        } else {
          try {
            const result =
              await WALLET.MetamaskFlask.methods.SendTransactionZkApp({
                transaction: zkBody.partiesJsonUpdate,
                feePayer: {
                  memo: '',
                  fee: fee
                }
              })
            if (result) {
              setLoading(false)
              setSendMessageResult(JSON.stringify(result))
            }
          } catch (error) {
            setLoading(false)
            console.log(error)
            setSendMessageResult(JSON.stringify(error))
          }
        }
      }
    } catch (errorInfo) {}
  }

  return (
    <Card title='Send zkApp transaction' type='inner'>
      <Form
        form={form}
        autoComplete='off'
        {...layout}
        onFinish={sendButton}
        hideRequiredMark
        labelWrap
      >
        <Form.Item
          label='Can you input correct state?'
          name='answer'
          rules={[
            {
              required: true,
              message: 'Please input Parameter!'
            }
          ]}
        >
          <Input
            placeholder='Parameter'
            suffix={
              <Tooltip
                overlayStyle={{ width: 290 }}
                title={
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>
                      Correct state calculation formula
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontStyle: 'italic',
                        fontWeight: 400
                      }}
                    >
                      Correct state = the square of the Current state
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontStyle: 'italic',
                        fontWeight: 400
                      }}
                    >
                      e.g.
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontStyle: 'italic',
                        fontWeight: 400
                      }}
                    >
                      Current state (checked) = 3;
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontStyle: 'italic',
                        fontWeight: 400
                      }}
                    >
                      Correct state = 3*3 = 9
                    </div>
                  </div>
                }
                color='#727272'
              >
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </Form.Item>
        <div className='submit-section'>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                className='bg-white'
                shouldUpdate
                wrapperCol={{ span: 24, offset: 0 }}
              >
                {() => (
                  <Button
                    loading={loading}
                    type='primary'
                    htmlType='submit'
                    disabled={
                      !form.getFieldValue('answer') ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                    block
                  >
                    Send
                  </Button>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className='bg-white'
                wrapperCol={{ span: 24, offset: 0 }}
              >
                <Button
                  loading={loadingGetStateZkap}
                  type='primary'
                  onClick={getStateZkapp}
                  block
                >
                  Check current state
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
      <p className='info-text alert alert-secondary mt-3 text-break'>
        Send Result: <p id='sendResultDisplay'>{sendMessageResult}</p>
      </p>
    </Card>
  )
}

export default SendZkapp
