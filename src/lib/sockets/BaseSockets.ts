
import { Server, Socket } from 'socket.io';

export let SOCKET_SERVER: Server;

export class BaseSockets{

    public io: Server;

    constructor(io: Server){
        this.io = io;
        SOCKET_SERVER = io;
    }

    public listen() :void {
        this.io.on('connection', (socket: Socket) => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
            console.log( `socket clients connected: ${SOCKET_SERVER.engine.clientsCount}` );

        });
    }



}
