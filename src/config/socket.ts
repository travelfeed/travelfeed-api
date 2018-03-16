import { Server } from 'http'
import * as socketIo from 'socket.io'

export class Socket {
    private io: socketIo.Server

    public constructor(server: Server) {
        this.io = socketIo(server)
        this.initSocket()
    }

    private initSocket(): void {
        this.io.on('connection', socket => {
            console.log('a user connected')

            socket.on('disconnect', () => {
                console.log('a user disconnected')
            })
        })
    }
}
