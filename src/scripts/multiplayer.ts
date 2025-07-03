import { io, Socket } from 'socket.io-client';
import { updateMiniBoard, removeMiniBoard } from './mini_boards';

const hostButton = document.querySelector('.host');
const joinButton = document.querySelector('.join');
const leaveButton = document.querySelector('.leave');
const nameInput = document.querySelector('.playerName') as HTMLInputElement | null;
const roomCodeInput = document.querySelector('.roomCodeInput') as HTMLInputElement | null;
const playerList = document.querySelector('.player-names') as HTMLUListElement | null;
const playerListContainer = document.querySelector('#playerListContainer')
const roomCodeContainer = document.querySelector('#roomCodeContainer');
const roomCodeDisplay = roomCodeContainer.querySelector('#roomCodeDisplay')

export let socket: Socket | null = null;
export let roomCodeString: string = null
const serverDomain: string = 'http://localhost:3000'

hostButton?.addEventListener('click', () => {
    if (!socket) {
        socket = io(serverDomain);
        socket.on('connect', () => {
            console.log('Connected as host');
            let name: string = nameInput?.value || socket!.id;
            createRoom(name);
            setupRoomListeners();
        });
    }
});

joinButton?.addEventListener('click', () => {
    if (!roomCodeInput?.value) {
        console.log("Room code is empty.");
        return;
    }
    if (!socket) {
        socket = io(serverDomain);
        socket.on('connect', () => {
            console.log('Connected as joiner');
            let name: string = nameInput?.value || socket!.id;
            joinRoom(roomCodeInput.value, name);
            setupRoomListeners();
        });
    } else {
        let name: string = nameInput?.value || socket!.id;
        joinRoom(roomCodeInput.value, name);
    }
});

leaveButton?.addEventListener('click', () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        updatePlayerList([]);
        console.log('Left room and disconnected');
        roomCodeContainer.classList.add('hidden')
        playerListContainer.classList.add('hidden')
        leaveButton.classList.add('hidden')
    }
});

function setupRoomListeners() {
    if (!socket) return;
    socket.on('roomUpdate', (room) => {
        if (room && Array.isArray(room.players)) {
            const currentIds = room.players.map((p: any) => p.id);
            const allMiniIds = Array.from(document.querySelectorAll('.mini-board')).map(div => div.getAttribute('data-id'));
            allMiniIds.forEach(id => {
                if (id && !currentIds.includes(id) && id !== socket.id) {
                    removeMiniBoard(id);
                }
            });
            updatePlayerList(room.players.map((p: any) => p.name));
        }
    });
    socket.on("gameStateUpdate", ({ id, gameState }) => {
        console.log(id)
        if (id !== socket.id) {
            console.log(`Received game state from ${id}:`, gameState);
            // Send data to miniBoard
            updateMiniBoard(id, { ...gameState, id, name: id })
        }
    });
}

function updatePlayerList(names: string[]) {
    if (!playerList) return;
    playerList.innerHTML = '';
    names.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        playerList.appendChild(li);
    });
}

function createRoom(playerName: string) {
    socket?.emit("createRoom", playerName, (response) => {
        console.log(response);
        if (response.roomCode) {
            console.log("Room created:", response.roomCode);
            roomCodeDisplay.textContent = `Room Code: ${response.roomCode}`;
            roomCodeString = response.roomCode
            roomCodeContainer.classList.remove('hidden')
            playerListContainer.classList.remove('hidden')
            leaveButton.classList.remove('hidden')
        }
    });
}

function joinRoom(roomCode: string, playerName: string) {
    socket?.emit("joinRoom", { roomCode, playerName }, (response) => {
        console.log(response);
        if (response?.success) {
            console.log("Joined room:", roomCode);
            roomCodeDisplay.textContent = `Room Code: ${roomCode}`; 
            roomCodeString = roomCode
            roomCodeContainer.classList.remove('hidden')
            playerListContainer.classList.remove('hidden')
            leaveButton.classList.remove('hidden')
        } else {
            console.error(response?.error || "Failed to join room");
        }
    });
}