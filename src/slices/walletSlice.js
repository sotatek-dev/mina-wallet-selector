/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accountName: '',
  balance: '',
  inferredNonce: '',
  activeAccount: '',
  isInstalledWallet: false,
  isInstalledSnap: false,
  connected: false,
  network: 'Mainnet'
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setNetWorkStore: (state, { payload }) => {
      state.network = payload
    },
    clearActiveAccount: (state) => {
      state.activeAccount = ''
      state.balance = ''
      state.accountName = ''
      state.inferredNonce = ''
    },
    setActiveAccount: (state, { payload }) => {
      state.activeAccount = payload.activeAccount
      state.balance = payload.balance
      state.accountName = payload.accountName
      state.inferredNonce = payload.inferredNonce
    },
    setSnapInstalled: (state, { payload }) => {
      state.isInstalledSnap = payload
    },
    setWalletInstalled: (state, { payload }) => {
      state.isInstalledWallet = payload
    },
    login: (state) => {
      state.connected = true
      return state
    },
    changeWalletBoforeConnect: (state) => {
      state.connected = false
      return state
    },
    logout: (state) => {
      state.connected = false
      state.activeAccount = ''
      state.balance = ''
      state.accountName = ''
      state.inferredNonce = ''
      localStorage.clear()
      return state
    }
  }
})

export const {
  setActiveAccount,
  clearActiveAccount,
  setNetWorkStore,
  login,
  setWalletInstalled,
  setTransactions,
  changeWalletBoforeConnect,
  logout
} = walletSlice.actions

export default walletSlice.reducer
