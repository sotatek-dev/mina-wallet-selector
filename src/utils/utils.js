/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
import React from 'react'
import axios from 'axios'
import bs58check from 'bs58check'
import { Buffer } from 'buffer'

export const decodeMemo = (encode) => {
  try {
    const encoded = bs58check.decode(encode)
    const res = encoded.slice(3, 3 + encoded[2]).toString('utf-8')
    return res
  } catch (err) {
    return encode
  }
}

export const addressValid = (address) => {
  try {
    const bytes = bs58check.decode(address)
    const decodedAddress = Buffer.from(bytes).toString('hex')
    return !!decodedAddress && decodedAddress.length === 72
  } catch (ex) {
    console.log(ex)
    return false
  }
}

export const reverse = (bytes) => {
  const reversed = Buffer.alloc(bytes.length)
  for (let i = bytes.length; i > 0; i--) {
    reversed[bytes.length - i] = bytes[i - 1]
  }
  return reversed
}

/**
 * Get GraphQL operation name.
 *
 * @param query - GraphQL query.
 * @returns `string`
 */
export function getOperationName(query = '') {
  const queryMatch = query.match(/(query|mutation) (\w+)(?=[(\s{])/u)

  if (queryMatch?.[2]) {
    return queryMatch[2]
  }

  throw new Error('GQL not valid')
}

export const getLatestSnapVersion = async () => {
  const snapNpmUrl = process.env.REACT_APP_SNAP_URL ? process.env.REACT_APP_SNAP_URL : `https://registry.npmjs.org/mina-snap/latest`
  const version = await axios
    .get(snapNpmUrl)
    .then((res) => {
      const data = res.data
      return data.version
    })
    .catch((error) => console.log(error))
  return version
}

export const formatBalance = (balance, dec = 4) => {
  const balanceNumb = Number(balance)
  if (balanceNumb > 0) {
    const [whole, decimal] = balance.split('.')
    const last = decimal.slice(0, dec)
    if (Number(last) === 0) {
      return whole
    }

    return whole + '.' + last
  }
  return '0'
}

export function formatMoney(number, unit = '', notInit, fixedNumber = 4) {
  if (typeof number === 'string') {
    return `${number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${
      unit ? `${unit}` : ''
    }`
  }
  if (!!number || number === 0) {
    if (!Number(number) && number !== 0) {
      return number
    }
    if (number === 0) {
      return `${number}${unit ? `${unit}` : ''}`
    }
    if ((number > 0 && number < 1) || (number < 0 && number > -1)) {
      return `${number.toFixed(fixedNumber)}${unit ? `${unit}` : ''}`
    }
    if (number % 2 !== 0 && number - Math.floor(number) > 0) {
      if (
        number.toString().split('.')[1] &&
        number.toString().split('.')[1].length > 2
      ) {
        const newNumber =
          number - Math.floor(number.toFixed(fixedNumber)) > 0
            ? number.toFixed(fixedNumber)
            : number.toFixed(0)
        return `${newNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${
          unit ? `${unit}` : ''
        }`
      }
      return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${
        unit ? `${unit}` : ''
      }`
    }
    return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${
      unit ? `${unit}` : ''
    }`
  }
  if (notInit) {
    return ''
  }
  return '--'
}

export const blockInvalidChar = (e) =>
  ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()

export const blockInvalidInt = (e) =>
  ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()

export const toPlainString = (num) => {
  return ('' + +num).replace(
    /(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    function (a, b, c, d, e) {
      return e < 0
        ? b + '0.' + Array(1 - e - c.length).join('0') + c + d
        : b + c + d + Array(e - d.length + 1).join('0')
    }
  )
}

export const formatAddress = (address = '') => {
  const firstFiveCharacters = address.slice(0, 10)
  const lastFiveCharacters = address.slice(address.length - 10, address.length)
  return firstFiveCharacters + '...' + lastFiveCharacters
}

export const handelCoppy = (data = '', id = '') => {
  // navigator.clipboard.writeText(privateKey as string);

  const storage = document.createElement('textarea')
  storage.value = data
  const element = document.querySelector(id)
  element?.appendChild(storage)
  storage.select()
  storage.setSelectionRange(0, 99999)
  document.execCommand('copy')
  element?.removeChild(storage)
}

export const getUrlProxy = (network) => {
  let urlProxy = 'https://proxy.minaexplorer.com/'
  if (network === 'Mainnet') urlProxy = 'https://proxy.minaexplorer.com/'
  if (network === 'Devnet') urlProxy = 'https://proxy.devnet.minaexplorer.com/'
  if (network === 'Berkeley')
    urlProxy = 'https://proxy.berkeley.minaexplorer.com/'
  return urlProxy
}

export const openLinkInstallFlask = (wallet) => {
  const auroLink =
    'https://chrome.google.com/webstore/detail/auro-wallet/cnmamaachppnkjgnildpdmkaakejnhae'
  const MetamaskFlaskLink =
    'https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk'
  if (wallet === 'Auro') {
    window?.open(auroLink, '_blank')?.focus()
  } else {
    window?.open(MetamaskFlaskLink, '_blank')?.focus()
  }
}

export const dateFomat = 'YYYY-MM-DD hh:mm:ss'
