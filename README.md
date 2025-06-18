# Suika With Friends

A browser-based physics puzzle game inspired by Suika, featuring both offline and real-time multiplayer modes. Play solo or challenge your friends by hosting or joining rooms using unique codes and shareable links. The project demonstrates robust multiplayer implementations using both Node.js (Socket.IO) and Go (Gorilla WebSocket).

---

## Features

- **Physics Puzzle Gameplay:** Drop and merge fruits to achieve the highest score possible.
- **Offline Mode:** Enjoy the game solo without any network connection.
- **Online Multiplayer:** Host or join real-time matches with friends using room codes or shareable links.
- **Room System:** Easily create, join, and share game sessions.
- **Multiple Backends:** Main multiplayer backend in Node.js/Socket.IO, with an alternative Go server to showcase backend versatility.
- **Modern UI:** Clean, responsive interface built with Astro and Tailwind CSS.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for the main multiplayer backend)
- [Go](https://golang.org/) (optional, for the Go backend)
- [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/suika-with-friends.git
   cd suika-with-friends
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

---

## Running the Game

### Offline (Single Player)

Simply start the frontend and play in your browser:
```bash
pnpm run dev
# or
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

### Online Multiplayer (Node.js Backend)

1. **Start the multiplayer server:**
   ```bash
   node server/server.js
   ```
2. **Start the frontend:**
   ```bash
   pnpm run dev
   ```
3. **Play:**  
   - Host a room to get a code or link.
   - Share the code/link with a friend to join the same game.

---

### Alternative Go Backend (Optional)

1. **Build and run the Go server:**
   ```bash
   cd go-server
   go run *.go
   ```
2. **Update the frontend WebSocket URL if needed.**

---

## Technologies Used

- Astro
- Tailwind CSS
- TypeScript
- Node.js + Socket.IO
- Go + Gorilla WebSocket

---

## Credits

- Inspired by the original Suika Game.
- Fruit images and assets © their respective owners.
