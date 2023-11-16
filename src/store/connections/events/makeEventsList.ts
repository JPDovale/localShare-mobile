import { Manager, Socket } from 'socket.io-client'
import { connect } from './connect'
import { GetUseConnections, SetUseConnections } from '..'
import { disconnected } from './disconnected'
import { getFilePart } from './getFilePart'

export interface MakeEventsListProps {
  socket: Socket
  idConnection: string
  manager: Manager
  get: GetUseConnections
  set: SetUseConnections
  data?: unknown
}

export function makeEventsList(props: MakeEventsListProps) {
  return [connect(props), disconnected(props), getFilePart(props)]
}
