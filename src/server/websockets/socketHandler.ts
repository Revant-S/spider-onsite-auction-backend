import { Server, Socket } from 'socket.io';
import debug from 'debug';
const socketDebugger = debug("app:socketDebugger")


export function setupSocketHandlers(io: Server) {
    io.on('connection', (socket: Socket) => {
        socketDebugger('a user connected');
        socket.on('message', (data) => {
            socketDebugger(`Message received: ${data}`);
            socket.broadcast.emit('message', data);
        });
        socket.on('disconnect', () => {
            socketDebugger('user disconnected');
        });
        socket.emit('welcome', 'Welcome to the WebSocket server!');
    });
}