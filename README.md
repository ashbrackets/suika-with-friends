# Suika With Friends

A browser-based physics puzzle game inspired by Suika, featuring both offline and real-time multiplayer modes. Play solo or challenge your friends by hosting or joining rooms using unique codes and shareable links. The project demonstrates robust multiplayer implementations using Node.js (Socket.IO).

---

## Features

- **Physics Puzzle Gameplay:** Drop and merge fruits to achieve the highest score possible.
- **Offline Mode:** Enjoy the game solo without any network connection.
- **Online Multiplayer:** Host or join real-time matches with friends using room codes or shareable links.
- **Room System:** Easily create, join, and share game sessions.
- **Multiple Backends:** Multiplayer backend in Node.js/Socket.IO
- **Modern UI:** Clean, responsive interface built with Astro and Tailwind CSS.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for the main multiplayer backend)
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
Visit [http://localhost:4321](http://localhost:4321) in your browser.

---

### Online Multiplayer (Node.js Backend)

1. **Start the multiplayer server:**
   ```bash
   pnpm run server
   # or
   npm run server
   ```
2. **Start the frontend:**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```
3. **Play:**  
   - Host a room to get a code or link.
   - Share the code/link with a friend to join the same game.

---

## Technologies Used

- Astro
- Tailwind CSS
- TypeScript
- Node.js + Socket.IO

---

## Credits

- Inspired by the original Suika Game.
- Fruit images and assets © their respective owners.
