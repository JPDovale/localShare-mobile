import { Connection } from '..'
import { MakeEventsListProps } from './makeEventsList'

export function disconnected({
  get,
  idConnection,
  set,
  manager,
  socket,
}: MakeEventsListProps) {
  const { connections } = get()

  return socket.on('disconnect', () => {
    const oldConnections = connections.filter(
      (connection) => connection.idConnection !== idConnection,
    )

    const newConnections: Connection[] = [
      ...oldConnections,
      {
        idConnection,
        manager,
        socket,
        status: 'disconnected',
      },
    ]

    set({
      connections: newConnections,
    })
  })
}
