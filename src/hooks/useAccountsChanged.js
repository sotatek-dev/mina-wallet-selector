/* eslint-disable no-undef */
import { useEffect } from 'react'
import { WALLET } from '../services/multipleWallet'
import { getUrlProxy } from '../utils/utils'

export const useAccountsChanged = () => {
  useEffect(() => {
    if (!localStorage.getItem('wallet')) return null
    if (localStorage.getItem('wallet') === 'Auro') {
      return window?.mina?.on('accountsChanged', async (accounts) => {
        const { account: accountInfor } =
          await WALLET.Auro.methods.getAccountInfors(
            accounts.toString(),
            getUrlProxy(network)
          )
        return accountInfor
      })
    } else {
      return window?.ethereum?.on('accountsChanged', async (accounts) => {
        return accounts
      })
    }
  }, [])
}
