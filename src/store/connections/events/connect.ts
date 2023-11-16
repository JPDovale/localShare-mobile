import { Connection } from '..'
import { MakeEventsListProps } from './makeEventsList'

export function connect({
  socket,
  idConnection,
  manager,
  get,
}: MakeEventsListProps) {
  const { connections, setConnections } = get()

  return socket.on('connect', () => {
    const oldConnections = connections.filter(
      (connection) => connection.idConnection !== idConnection,
    )

    const newConnections: Connection[] = [
      ...oldConnections,
      {
        idConnection,
        manager,
        socket,
        status: 'connected',
      },
    ]

    setConnections(newConnections)
  })
}
