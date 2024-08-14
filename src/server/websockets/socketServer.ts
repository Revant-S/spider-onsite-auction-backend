import { Server as SocketIOServer } from 'socket.io';
import express from 'express';
import http from 'http';
import debug from 'debug';
// import config from 'config';
import Item from '../models/itemsModel';
import Auction from '../models/auctionModel';
import { errorDegugger } from '../controllers/authControllers';
import User from '../models/userModal';

const socketDebugger = debug("app:socketDebugger");
const app = express();
const server = http.createServer(app);

interface AuctionData {
    itemid: string;
    hours: number;
    userId: string;
}

const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socketDebugger('A user connected');

    socket.on('createAuction', async (rawData: string | AuctionData) => {
        try {
            let data: AuctionData;
            if (typeof rawData === 'string') {
                data = JSON.parse(rawData);
            } else {
                data = rawData;
            }


            socketDebugger(data.userId)
            const user = await User.findById(data.userId);
            if (!user) {
                socket.emit('error', { message: 'User Not Found' });
                return;
            }

            const { itemid, hours } = data;
            const item = await Item.findById(itemid);
            if (!item) {
                socket.emit('error', { message: 'Item Not Found' });
                return;
            }

            const currentPrice = item.startingPrice;
            const verifyOwner = item.owner.toString() === user._id.toString();
            if (!verifyOwner) {
                socket.emit('error', { message: 'You are not the owner of this artifact' });
                return;
            }

            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);

            const newAuction = await Auction.create({
                item: itemid,
                currentPrice,
                endTime
            });

            const roomName = `auction-${newAuction._id}`;
            newAuction.roomId = roomName;
            await newAuction.save();

            socket.join(roomName);
            socketDebugger(`Socket ${socket.id} joined room ${roomName}`);

            socket.emit('auctionCreated', { auction: newAuction, room: roomName });
            io.emit('auctionCreated', { auction: newAuction, room: roomName });

        } catch (error) {
            console.error('Error in createAuction:', error);
            errorDegugger(error instanceof Error ? error.message : 'Unknown error');
            socket.emit('error', { message: 'An error occurred while creating the auction' });
        }
    });

    socket.on('disconnect', (reason: string) => {
        socketDebugger(`User disconnected. Reason: ${reason}`);
    });

    socket.emit('welcome', 'Welcome to the Web Socket server!');
});

const SOCKET_PORT = 5000


export function startsocketServer() {
    server.listen(SOCKET_PORT, () => {
        socketDebugger(`WebSocket server is running on port ${SOCKET_PORT}`);
    });
}