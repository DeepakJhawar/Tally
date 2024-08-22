import { Server } from 'socket.io';

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN_URL, // React app's origin, adjust if necessary
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinRoom', ({ contestId }) => {
            socket.join(contestId);
            console.log(`user joined room ${contestId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

const getSocketInstance = () => io;

export { getSocketInstance, initializeSocket };