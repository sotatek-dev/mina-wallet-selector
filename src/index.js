import React from 'react'
import PropTypes from 'prop-types'
import Connect from './components/connect'
import Send from './components/send'
import Sign from './components/sign'
import SendZkapp from './components/send-zkapp'
import AppProvider from './provider'
import { WALLET } from './services/multipleWallet'
import useCheckConnect from './hooks/useCheckConnect'


export const methods = WALLET

export const hooks = useCheckConnect

export const SelectWallet = ({ children, data }) => {
  return (
    <AppProvider>
      <Connect data={data} />
    </AppProvider>
  )
}

export const SendWallet = ({ children, data }) => {
  return (
    <AppProvider>
      <Send data={data} />
    </AppProvider>
  )
}

export const SignWallet = ({ children, data }) => {
  return (
    <AppProvider>
      <Sign data={data} />
    </AppProvider>
  )
}

export const SendTransactionZkapp = ({ children, data, zkAppAddress }) => {
  return (
    <AppProvider>
      <SendZkapp data={data} zkAppAddress={zkAppAddress}>
        {children}
      </SendZkapp>
    </AppProvider>
  )
}

SelectWallet.propTypes = {
  children: PropTypes.node,
  data: PropTypes.func
}

SendWallet.propTypes = {
  children: PropTypes.node,
  data: PropTypes.func
}

SignWallet.propTypes = {
  children: PropTypes.node,
  data: PropTypes.func
}

SendTransactionZkapp.propTypes = {
  children: PropTypes.node,
  data: PropTypes.func,
  zkAppAddress: PropTypes.string
}
