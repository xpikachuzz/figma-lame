import { useEffect } from 'react'
import socket from '../socket'

export const useSocketSetup = () => {

  useEffect(() => {
    socket.connect()
  }, [])
}
