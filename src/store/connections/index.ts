import { Manager, Socket } from 'socket.io-client'
import { create } from 'zustand'
import { makeEventsList } from './events/makeEventsList'
import { DocumentPickerResult } from 'expo-document-picker'

export type Connection = {
  idConnection: string
  manager: Manager
  socket: Socket
  status: 'connected' | 'connecting' | 'disconnected'
}

interface UseConnections {
  connections: Connection[]

  addConnection: (idConnection: string) => void
  setConnections: (connections: Connection[]) => void
  uploads: (files: DocumentPickerResult, idConnection: string) => void
  remove: (connection: Connection) => void
}

export type GetUseConnections = () => UseConnections
export type SetUseConnections = (
  partial:
    | UseConnections
    | Partial<UseConnections>
    | ((state: UseConnections) => UseConnections),
  replace?: boolean,
) => void

export const useConnections = create<UseConnections>((set, get) => {
  return {
    connections: [],

    addConnection: (idConnection) => {
      const { connections } = get()
      const connectionExiste = connections.find(
        (connection) => connection.idConnection === idConnection,
      )

      if (connectionExiste && connectionExiste.status === 'connected') {
        return
      }

      const manager = new Manager(`https://${idConnection}.ngrok.io`, {
        requestTimeout: 1000 * 60 * 60 * 24,
        timeout: 1000 * 60 * 60 * 24,
      })
      const socket = manager.socket('/')

      manager.open()

      makeEventsList({ idConnection, manager, socket, set, get })
    },

    setConnections: (connections) => {
      set({ connections })
    },

    uploads: (files, idConnection) => {
      const { connections } = get()
      const connectionExiste = connections.find(
        (connection) => connection.idConnection === idConnection,
      )

      if (!connectionExiste) return

      const chunkSize = 1024 * 512
      connectionExiste.socket.emit('downloads-metadata', {
        chunkSize,
        files,
      })
    },

    remove: (connection: Connection) => {
      const { connections } = get()

      if (connection.status === 'connected') {
        connection.socket.disconnect()
      }

      set({
        connections: connections.filter(
          (conn) => conn.idConnection !== connection.idConnection,
        ),
      })
    },
  }
})
