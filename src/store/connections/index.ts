import { Manager, Socket } from 'socket.io-client'
import { create } from 'zustand'

export type Connection = {
  ip: string
  manager: Manager
  socket: Socket
  status: 'connected' | 'connecting' | 'disconnected'
}

interface UseConnections {
  connections: Connection[]

  addConnection: (ip: string) => void
}

export const useConnections = create<UseConnections>((set, get) => {
  return {
    connections: [],

    addConnection: (ip) => {
      const { connections } = get()
      const connectionExiste = connections.find(
        (connection) => connection.ip === ip,
      )

      if (connectionExiste && connectionExiste.status === 'connected') {
        return
      }

      const manager = new Manager(`http://${ip}:3004`, {
        requestTimeout: 1000 * 60 * 60 * 24,
        timeout: 1000 * 60 * 60 * 24,
      })
      const socket = manager.socket('/')

      manager.open()

      socket.on('connect', () => {
        const oldConnections = connections.filter(
          (connection) => connection.ip !== ip,
        )

        set({
          connections: [
            ...oldConnections,
            {
              ip,
              manager,
              socket,
              status: 'connected',
            },
          ],
        })
      })

      socket.on('disconnect', () => {
        const oldConnections = connections.filter(
          (connection) => connection.ip !== ip,
        )

        set({
          connections: [
            ...oldConnections,
            {
              ip,
              manager,
              socket,
              status: 'disconnected',
            },
          ],
        })
      })

      set({
        connections: [
          ...connections,
          {
            ip,
            manager,
            socket,
            status: 'connecting',
          },
        ],
      })
    },
  }
})
