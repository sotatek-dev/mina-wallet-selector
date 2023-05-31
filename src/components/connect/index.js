/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { Segmented, Space, Button, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import MetamaskFlask from '../../icon/meta'
import Auro from '../../icon/auro'
import { WALLET } from '../../services/multipleWallet'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import {
  formatBalance,
  formatAddress,
  getUrlProxy,
  openLinkInstallFlask
} from '../../utils/utils'
import {
  login,
  logout,
  setActiveAccount,
  clearActiveAccount,
  setNetWorkStore,
  setWalletInstalled,
  changeWalletBoforeConnect
} from '../../slices/walletSlice'
import { useHasWalet } from '../../hooks/useHasWalet'
import detectEthereumProvider from '@metamask/detect-provider'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../src/styles.css'

const ethers = require('ethers')

function Connect(props) {
  const dispatch = useAppDispatch()
  const { isInstalledWallet, activeAccount, balance, network, connected } =
    useAppSelector((state) => state.wallet)
  const [value, setNetWorkState] = useState(network)
  const [stateWallet, setStateWallet] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingBalance, setLoadingBalance] = useState(false)

  const checkLogOut = async () => {
    if (localStorage.getItem('wallet') === 'MetamaskFlask') {
      const getIsUnlocked = async () =>
        await window?.ethereum._metamask.isUnlocked()
      const isUnlocked = await getIsUnlocked()
      if (!isUnlocked) {
        dispatch(changeWalletBoforeConnect())
        dispatch(clearActiveAccount())
      }
    }
    if (window?.mina && localStorage.getItem('wallet') === 'Auro') {
      dispatch(changeWalletBoforeConnect())
      dispatch(clearActiveAccount())
      const result = await WALLET.Auro.methods
        .connectToAuro()
        .catch((err) => err)
      if (result) dispatch(login())
    }
  }

  useHasWalet(checkLogOut)

  useEffect(() => {
    dispatch(setNetWorkStore(value))
  }, [value])

  const requestNetWork = async () => {
    const info = await WALLET.MetamaskFlask.methods.GetNetworkConfigSnap()
    if (info) setNetWorkState(info?.name)
  }

  useEffect(() => {
    if (!localStorage.getItem('wallet')) return
    if (localStorage.getItem('wallet') === 'Auro') {
      window?.mina?.on('chainChanged', async (network) => {
        const result = await WALLET.Auro.methods.connectToAuro()
        setNetWorkState(network)
        if (result.message) {
          setLoading(false)
        } else {
          setLoading(false)
          const { account: accountInfor } =
            await WALLET.Auro.methods.getAccountInfors(
              result.toString(),
              getUrlProxy(network)
            )
          dispatch(login())
          dispatch(
            setActiveAccount({
              activeAccount: accountInfor.publicKey,
              balance: ethers.utils.formatUnits(
                accountInfor.balance.total,
                'gwei'
              ),
              accountName: accountInfor.name,
              inferredNonce: accountInfor.inferredNonce
            })
          )
        }
      })
    } else {
      requestNetWork()
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('wallet')) return
    if (localStorage.getItem('wallet') === 'Auro') {
      window?.mina?.on('accountsChanged', async (accounts) => {
        setLoading(false)
        const { account: accountInfor } =
          await WALLET.Auro.methods.getAccountInfors(
            accounts.toString(),
            getUrlProxy(network)
          )
        dispatch(login())
        dispatch(
          setActiveAccount({
            activeAccount: accountInfor.publicKey,
            balance: ethers.utils.formatUnits(
              accountInfor.balance.total,
              'gwei'
            ),
            accountName: accountInfor.name,
            inferredNonce: accountInfor.inferredNonce
          })
        )
      })
    } else {
      window?.ethereum?.on('accountsChanged', async (accounts) => {
        console.log(accounts)
      })
    }
  }, [])

  const checkInstallWhenCallAction = async () => {
    if (localStorage.getItem('wallet') === 'Auro') {
      if (window?.mina) dispatch(setWalletInstalled(true))
      if (!window?.mina) dispatch(setWalletInstalled(false))
    } else {
      try {
        const provider = await detectEthereumProvider({
          mustBeMetaMask: false,
          silent: true,
          timeout: 3000
        })
        const isFlask = (
          await provider?.request({ method: 'web3_clientVersion' })
        )?.includes('flask')
        if (provider && isFlask) {
          dispatch(setWalletInstalled(true))
        } else dispatch(setWalletInstalled(false))
      } catch (e) {
        dispatch(setWalletInstalled(false))
        setLoading(false)
      }
    }
  }

  const connectToAuro = async (isloadBalance) => {
    const result = await WALLET.Auro.methods.connectToAuro().catch((err) => {
      console.log('connectToAuro')
      setLoading(false)
    })
    const network = await window?.mina?.requestNetwork().catch((err) => {
      console.log('requestNetwork')
      setLoading(false)
    })
    setNetWorkState(network)
    if (result.message) {
      setLoading(false)
      if (isloadBalance) setLoadingBalance(false)
    } else {
      const { account: accountInfor } =
        await WALLET.Auro.methods.getAccountInfors(
          result.toString(),
          getUrlProxy(network)
        )
      dispatch(login())
      dispatch(
        setActiveAccount({
          activeAccount: accountInfor.publicKey,
          balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei'),
          accountName: accountInfor.name,
          inferredNonce: accountInfor.inferredNonce
        })
      )
      if (isloadBalance) setLoadingBalance(false)
      setLoading(false)
    }
  }

  const connectToMetaMaskFlask = async (isloadBalance) => {
    try {
      setNetWorkState(value)
      await WALLET.MetamaskFlask.methods.connectToSnap()
      await WALLET.MetamaskFlask.methods.SwitchNetwork(value)
      const accountInfor = await WALLET.MetamaskFlask.methods.getAccountInfors()
      dispatch(login())
      dispatch(
        setActiveAccount({
          activeAccount: accountInfor.publicKey,
          balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei'),
          accountName: accountInfor.name,
          inferredNonce: accountInfor.inferredNonce
        })
      )
      if (isloadBalance) setLoadingBalance(false)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    checkInstallWhenCallAction()
    dispatch(clearActiveAccount())
    const wallet = localStorage.getItem('wallet') || value || 'MetamaskFlask'
    if (wallet === 'Auro') {
      connectToAuro()
    } else {
      connectToMetaMaskFlask()
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('wallet')) return
    setTimeout(() => {
      checkInstallWhenCallAction()
      const wallet = localStorage.getItem('wallet')
      if (wallet === 'Auro') {
        connectToAuro()
      } else {
        connectToMetaMaskFlask()
      }
    }, 200)
  }, [])

  const handleChangeWallet = async (str) => {
    localStorage.setItem('wallet', str)
    setStateWallet(str)
    setLoading(false)
    if (connected) {
      if (str === 'Auro') {
        connectToAuro()
      } else {
        connectToMetaMaskFlask()
      }
    } else {
      dispatch(clearActiveAccount())
      await checkInstallWhenCallAction()
      dispatch(changeWalletBoforeConnect())
    }
  }

  const handleChageNetWork = async (str) => {
    setNetWorkState(str)
    const wallet = localStorage.getItem('wallet')
    if (!wallet) return
    if (wallet === 'MetamaskFlask') {
      await WALLET.MetamaskFlask.methods.SwitchNetwork(str).then(async () => {
        const accountInfor =
          await WALLET.MetamaskFlask.methods.getAccountInfors()
        dispatch(login())
        await dispatch(
          setActiveAccount({
            activeAccount: accountInfor.publicKey,
            balance: ethers.utils.formatUnits(
              accountInfor.balance.total,
              'gwei'
            ),
            accountName: accountInfor.name,
            inferredNonce: accountInfor.inferredNonce
          })
        )
      })
    }
    if (wallet === 'Auro') {
      setNetWorkState(str)
      // NOT SUPPORT
    }
  }

  const handleReloadBalance = () => {
    const wallet = localStorage.getItem('wallet')
    if (!wallet) return
    setLoadingBalance(true)
    if (wallet === 'Auro') {
      connectToAuro(true)
    } else {
      connectToMetaMaskFlask(true)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div>
      <Space direction='vertical'>
        <div className='chose-wallet'>
          <Segmented
            defaultValue={localStorage.getItem('wallet') || 'MetamaskFlask'}
            onChange={handleChangeWallet}
            options={[
              {
                label: (
                  <div style={{ paddingTop: 10 }}>
                   <MetamaskFlask/>
                  </div>
                ),
                value: 'MetamaskFlask'
              },
              {
                label: (
                  <div style={{ paddingTop: 10 }}>
                    <Auro />
                  </div>
                ),
                value: 'Auro'
              }
            ]}
          />
        </div>
        <Segmented
          disabled={
            stateWallet === 'Auro' || localStorage.getItem('wallet') === 'Auro'
          }
          value={value}
          onChange={handleChageNetWork}
          options={['Mainnet', 'Devnet', 'Berkeley']}
        />
        {!isInstalledWallet ? (
          <Button
            onClick={() => openLinkInstallFlask(localStorage.getItem('wallet'))}
            danger
          >
            {stateWallet || localStorage.getItem('wallet') === 'Auro'
              ? 'Please install Auro Wallet. Click here!'
              : 'Metamask Flask is required to run snap!'}
          </Button>
        ) : (
          <Space>
            <Button
              disabled={loading || connected}
              onClick={() => handleConnect()}
              loading={loading}
              type='primary'
            >
              Connect wallet
            </Button>
            {connected && (
              <Button onClick={handleLogout} type='primary' danger>
                Disconnect
              </Button>
            )}
          </Space>
        )}
      </Space>
      <hr />
      <Typography.Title level={4}>
        Accounts: {formatAddress(activeAccount)}
      </Typography.Title>
      <Space align='center'>
        <Typography.Title level={4} className='mb-0'>
          Balance: <span className='text-danger'>{formatBalance(balance)}</span>{' '}
          Mina
        </Typography.Title>
        {connected && (
          <Button
            className='pt-0'
            icon={<ReloadOutlined />}
            loading={loadingBalance}
            onClick={handleReloadBalance}
          />
        )}
      </Space>
    </div>
  )
}

export default Connect
