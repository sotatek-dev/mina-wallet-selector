/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Input, Collapse, Radio } from 'antd'
import { blockInvalidChar, addressValid } from '../../utils/utils'
import InputPrice from '../input'
import { CaretUpOutlined } from '@ant-design/icons'
import { WALLET } from '../../services/multipleWallet'
import { useAppSelector } from '../../hooks/redux'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../src/styles.css'

const { Panel } = Collapse

const Send = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [sendMessageResult, setSendMessageResult] = useState('')
  const [warning, setWarning] = useState('')
  const [placeholder, setPlaceholder] = useState('0.0101')
  const [, forceUpdate] = useState({})

  const { isInstalledWallet, connected, balance } = useAppSelector(
    (state) => state.wallet
  )

  useEffect(() => {
    forceUpdate({})
  }, [])

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const sendButton = async () => {
    const wallet = localStorage.getItem('wallet')
    if (!connected) return setSendMessageResult('Please connect wallet!')
    setSendMessageResult('')
    try {
      const values = await form.validateFields()
      setLoading(true)
      if (wallet === 'Auro') {
        const result = await WALLET.Auro.methods
          .SendTransaction({
            amount: values.sendAmount,
            to: values.receiveAddress,
            fee: values.sendFee2 ? values.sendFee2 : values.sendFee,
            memo: values.sendMemo
          })
          .catch((err) => {
            setLoading(false)
            setSendMessageResult(JSON.stringify(err))
            console.log(err)
          })
        if (result.hash) {
          setLoading(false)
          const newResult = {
            id: 'N/A',
            hash: result.hash,
            isDelegation: false,
            kind: 'N/A'
          }
          setSendMessageResult(JSON.stringify(newResult))
        } else {
          setLoading(false)
          setSendMessageResult(result.message)
        }
      } else {
        try {
          let newValues = {
            to: values.receiveAddress,
            amount: values.sendAmount,
            fee: values.sendFee
          }
          if (values.sendMemo) {
            newValues = { ...newValues, memo: values.sendMemo }
          }
          if (values.sendFee2) {
            newValues = { ...newValues, fee: values.sendFee2 }
          }
          const result = await WALLET.MetamaskFlask.methods
            .SendTransaction(newValues)
            .catch((_err) => {
              setLoading(false)
              setSendMessageResult(JSON.stringify(_err))
            })
          if (result) {
            setLoading(false)
            setSendMessageResult(JSON.stringify(result))
          } else {
            setLoading(false)
          }
        } catch (error) {
          setLoading(false)
          setSendMessageResult(JSON.stringify(error))
        }
      }
    } catch (errorInfo) {}
  }

  const handleChangeCollapse = () => {
    setOpen(!open)
  }

  const handleChangeFee = ({ target: { value } }) => {
    setPlaceholder(value)
  }

  const handleChangeFeeInput = (value) => {
    if (value === '0.0011' || value === '0.0101' || value === '0.201') {
      form.setFieldValue('sendFee', value)
    } else {
      form.setFieldValue('sendFee', '')
    }
  }

  const options = [
    { label: 'Slow', value: '0.0011' },
    { label: 'Default', value: '0.0101' },
    { label: 'Fast', value: '0.201' }
  ]

  return (
    <Card title='Send' type='inner'>
      <Form
        form={form}
        autoComplete='off'
        {...layout}
        onFinish={sendButton}
        hideRequiredMark
      >
        <Form.Item
          label='To'
          name='receiveAddress'
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error('Please input To!'))
                }
                if (value.substring(0, 3) !== 'B62') {
                  return Promise.reject(new Error('Invalid address format!'))
                }
                if (!addressValid(value)) {
                  return Promise.reject(
                    new Error('Please enter a valid wallet address!')
                  )
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input placeholder='Address' />
        </Form.Item>
        <Form.Item
          label='Amount'
          name='sendAmount'
          rules={[
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error('Please input Amount!'))
                }
                if (Number(value) > Number(balance)) {
                  return Promise.reject(new Error('Insufficient balance!'))
                }
                return Promise.resolve()
              }
            })
          ]}
        >
          <InputPrice placeholder='0' onKeyDown={blockInvalidChar} />
        </Form.Item>
        <Form.Item
          label='Memo (Optional)'
          name='sendMemo'
          rules={[
            {
              required: false,
              message: 'Please input Memo!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Fee'
          name='sendFee'
          rules={[
            {
              required: false,
              message: 'Please select Fee!'
            }
          ]}
          initialValue='0.0101'
        >
          <Radio.Group
            options={options}
            onChange={handleChangeFee}
            optionType='button'
          />
        </Form.Item>
        <hr className='m-0' />
        <Collapse
          ghost
          expandIcon={({ isActive }) => (
            <CaretUpOutlined rotate={isActive ? 0 : 180} />
          )}
          expandIconPosition='end'
          onChange={handleChangeCollapse}
        >
          <Panel header='Advanced' key='1' />
        </Collapse>
        <div style={{ height: open ? 'auto' : 0, position: 'relative' }}>
          <Form.Item
            label='Transaction Fee'
            name='sendFee2'
            help={
              warning ? (
                <span style={{ color: '#faad14' }}>
                  Fees are much higher than average
                </span>
              ) : null
            }
            rules={[
              () => ({
                validator(_, value) {
                  setWarning(false)
                  if (!value) {
                    return Promise.resolve()
                  }
                  if (Number(value) < 0.0011) {
                    return Promise.reject(
                      new Error(
                        `Invalid user command. Fee ${value} is less than the minimum fee of 0.0101`
                      )
                    )
                  }
                  if (Number(value) > 10) {
                    setWarning(true)
                    return Promise.resolve()
                  }
                  return Promise.resolve()
                }
              })
            ]}
          >
            <InputPrice
              placeholder={placeholder}
              onKeyDown={blockInvalidChar}
              onChange={handleChangeFeeInput}
            />
          </Form.Item>
        </div>
        <div className='submit-section'>
          <Form.Item
            className='bg-white'
            wrapperCol={{ span: 24, offset: 0 }}
            shouldUpdate
          >
            {() => (
              <Button
                loading={loading}
                type='primary'
                htmlType='submit'
                block
                disabled={
                  !form.getFieldValue('receiveAddress') ||
                  !form.getFieldValue('sendAmount') ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Send
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
      <p className='info-text alert alert-secondary mt-3 text-break'>
        Send Result: <span id='sendResultDisplay'>{sendMessageResult}</span>
      </p>
    </Card>
  )
}

export default Send
