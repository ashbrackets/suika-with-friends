import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:4321",
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

// Room state
const rooms = {};

function generateRoomCode(length = 6) {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

io.on("connection", (socket) => {
    console.log("Player Connected");

    socket.on("createRoom", (playerName, callback) => {
        let roomCode;
        do {
            roomCode = generateRoomCode(6);
        } while (rooms[roomCode]);
        rooms[roomCode] = { players: [] };
        socket.join(roomCode);
        rooms[roomCode].players.push({ id: socket.id, name: playerName });
        if (callback) callback({ roomCode });
        io.to(roomCode).emit("roomUpdate", rooms[roomCode]);
        console.log(rooms)
    });

    socket.on("joinRoom", ({ roomCode, playerName }, callback) => {
        const room = rooms[roomCode];
        console.log(rooms)
        if (!room) {
            if (callback) callback({ error: "Room not found" });
            return;
        }
        if (room.players.length >= 8) {
            if (callback) callback({ error: "Room full" });
            return;
        }
        socket.join(roomCode);
        room.players.push({ id: socket.id, name: playerName });
        if (callback) callback({ success: true });
        io.to(roomCode).emit("roomUpdate", room);
    });

    socket.on("disconnect", () => {
        console.log("Player Disconnected");
        // Remove player from all rooms
        for (const code in rooms) {
            const room = rooms[code];
            room.players = room.players.filter(p => p.id !== socket.id);
            if (room.players.length === 0) {
                delete rooms[code];
            } else {
                io.to(code).emit("roomUpdate", room);
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});