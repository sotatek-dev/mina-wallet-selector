/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import { useEffect } from 'react'
import { WALLET } from '../services/multipleWallet'

const requestNetWork = async () => {
  const info = await WALLET.MetamaskFlask.methods.GetNetworkConfigSnap()
  return info
}

useEffect(() => {
  if (!localStorage.getItem('wallet')) return null
  if (localStorage.getItem('wallet') === 'Auro') {
    window?.mina?.on('chainChanged', async (network) => {
      return network
    })
  } else {
    requestNetWork()
  }
}, [])
