import * as io from 'socket.io'
import { Server } from 'http'
import { logger, Handlers } from '../logger'

export interface SocketEvent {
    name: 'message' | 'custom'
    data: any
}

export class Socket {
    private logger: Handlers = logger('socket')
    private io: io.Server

    public constructor(server: Server) {
        this.io = io(server)
        this.io.on('connect', (socket: io.Socket) => {
            this.logger.debug(`user connected (#${socket.id})`)

            socket.on('message', event => {
                this.logger.silly('message', event)
            })

            socket.on('custom', event => {
                this.logger.silly('custom', event)
            })

            socket.on('disconnect', () => {
                this.logger.debug(`user disconnected (#${socket.id})`)
            })
        })
    }
}
