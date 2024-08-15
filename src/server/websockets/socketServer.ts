import { Server as SocketIOServer } from 'socket.io';
import express from 'express';
import http from 'http';
import debug from 'debug';
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
                endTime,
                startTime,
                status: 'active'
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

    socket.on("joinAuction", async (data: string | { auctionId: string, userId: string }) => {
        try {
            let auctionId: string;
            let auctionUserDetails: { auctionId: string, userId: string };
            if (typeof data === 'string') {
                auctionId = JSON.parse(data).auctionId;
                auctionUserDetails = JSON.parse(data);
            } else {
                auctionId = data.auctionId;
                auctionUserDetails = data;
            }
            const user = await User.findById(auctionUserDetails.userId);
            if (!user) {
                return socket.emit('error', { message: 'User Not Found' });
            }
            const auction = await Auction.findById(auctionId)
                .populate('item')
                .populate('currentHighestBidder', 'username')
                .populate('bids.bidder', 'username');

            if (!auction) {
                socket.emit('error', { message: 'Auction not found' });
                return;
            }

            const roomName = `auction-${auctionId}`;
            socket.join(roomName);
            socketDebugger(`Socket ${socket.id} joined auction room ${roomName}`);

            const auctionDetails = {
                _id: auction._id,
                item: {
                    _id: auction.item._id,
                    name: auction.item.name,
                    description: auction.item.description,
                    startingPrice: auction.item.startingPrice,
                },
                startTime: auction.startTime,
                endTime: auction.endTime,
                currentPrice: auction.currentPrice,
                currentHighestBidder: auction.currentHighestBidder ? auction.currentHighestBidder.username : null,
                status: auction.status,
                bids: auction.bids.map((bid: any) => ({
                    bidder: bid.bidder.username,
                    amount: bid.amount,
                    time: bid.time
                })),
            };

            socket.emit('auctionJoined', {
                message: 'You have successfully joined the auction',
                auctionDetails: auctionDetails
            });

            return socket.to(roomName).emit('userJoined', { message: 'A new user has joined the auction' });

        } catch (error) {
            console.error('Error in joinAuction:', error);
            errorDegugger(error instanceof Error ? error.message : 'Unknown error');
            return socket.emit('error', { message: 'An error occurred while joining the auction' });
        }
    });

    socket.on("placeBid", async (data: { auctionId: string, bidAmount: number, userId: string }) => {
        try {
 
            if (typeof(data)=== "string") {
                data = JSON.parse(data)
            }
            const { auctionId, bidAmount, userId } = data;
            const auction = await Auction.findById(auctionId);
            if (!auction) {
                return socket.emit('error', { message: 'Auction not found' });
            }

            if (bidAmount <= auction.currentPrice) {
                return socket.emit('error', { message: 'Bid amount must be higher than current price' });
            }

            auction.currentPrice = bidAmount;
            auction.currentHighestBidder = userId;
            auction.bids.push({
                bidder: userId,
                amount: bidAmount,
                time: new Date()
            });

            await auction.save();

            const roomName = `auction-${auctionId}`;
            io.to(roomName).emit('newBid', {
                newPrice: bidAmount,
                bidder: userId,
                time: new Date()
            });
            return 
        } catch (error) {
            console.error('Error in placeBid:', error);
            errorDegugger(error instanceof Error ? error.message : 'Unknown error');
            socket.emit('error', { message: 'An error occurred while placing the bid' });
            return 
        }
    });

    const checkAuctionEnd = async () => {
        const auctions = await Auction.find({ endTime: { $lte: new Date() }, status: 'active' });
        for (const auction of auctions) {
            auction.status = 'ended';
            await auction.save();
            io.to(auction.roomId).emit('auctionEnded', { message: 'The auction has ended', auctionId: auction._id });
        }
    };

    setInterval(checkAuctionEnd, 60 * 1000);

    socket.on('disconnect', (reason: string) => {
        socketDebugger(`User disconnected. Reason: ${reason}`);
    });

    socket.emit('welcome', 'Welcome to the Web Socket server!');
});

const SOCKET_PORT = 5000;

export function startsocketServer() {
    server.listen(SOCKET_PORT, () => {
        socketDebugger(`WebSocket server is running on port ${SOCKET_PORT}`);
    });
}
