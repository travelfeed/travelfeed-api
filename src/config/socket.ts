import * as socketIo from 'socket.io'
import { Server } from 'http'
import { logger, Handlers } from '../logger'

export class Socket {
    private logger: Handlers = logger('socket')
    private io: socketIo.Server

    public constructor(server: Server) {
        this.io = socketIo(server)
        this.initSocket()
    }

    private initSocket(): void {
        this.io.on('connection', socket => {
            this.logger.debug('a user connected')

            socket.on('disconnect', () => {
                this.logger.debug('a user disconnected')
            })
        })
    }
}
