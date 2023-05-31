import { useState, useEffect } from 'react'
import { useAppSelector } from './redux'

const useCheckConnect = (url) => {
  const [isConnect, setIsConnect] = useState(null)
  const { connected } = useAppSelector((state) => state.wallet)

  useEffect(() => {
    setIsConnect(connected)
  }, [connected])

  return isConnect
}

export default useCheckConnect
