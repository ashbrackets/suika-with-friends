import { gHeight, gWidth } from "./constants";
import { fruits } from "./fruits";

const fruitImages: Record<string, {img: HTMLImageElement, pivot: number[]}> = {};

preloadFruitImages(fruits)

function preloadFruitImages(fruitList: { name: string, texture: string, pivot: number[]}[]) {
    fruitList.forEach(fruit => {
        const img = new Image();
        img.src = fruit.texture;
        fruitImages[fruit.name] = {img: img, pivot: fruit.pivot};
    });
}

type MiniBoardState = {
    id: string;
    name: string;
    score: number;
    fruits: { name: string; x: number; y: number; angle: number }[];
};

const miniBoards: Record<string, HTMLDivElement> = {};
const miniBoardsContainer = document.getElementById('miniBoardsContainer');

export function updateMiniBoard(id: string, state: MiniBoardState) {
    if (!miniBoardsContainer) return;

    // Create mini board if it doesn't exist
    if (!miniBoards[id]) {
        const board = document.createElement('div');
        board.className = 'mini-board bg-white/20 rounded-lg p-2 flex flex-col items-center';
        board.setAttribute('data-id', id);
        board.innerHTML = `
            <div class="font-bold text-sm text-white" id="mini-name"></div>
            <div class="text-xs text-white" id="mini-score"></div>
            <canvas width="${gWidth / 5}" height="${gHeight / 5}" class="mini-canvas rounded bg-black/30"></canvas>
        `;
        miniBoards[id] = board;
        miniBoardsContainer.appendChild(board);
    }

    const board = miniBoards[id];
    (board.querySelector('#mini-name') as HTMLElement).textContent = state.name || id;
    (board.querySelector('#mini-score') as HTMLElement).textContent = `Score: ${state.score ?? 0}`;

    // Draw fruits on mini canvas
     const ctx = (board.querySelector('.mini-canvas') as HTMLCanvasElement).getContext('2d');
    ctx.clearRect(0, 0, gWidth / 5, gHeight / 5);
    const scale = 0.1;

    for (const fruit of state.fruits) {
        const fruitData = fruitImages[fruit.name]
        ctx.save();
        ctx.translate(fruit.x  / 5, fruit.y / 5);
        ctx.rotate(fruit.angle);

        const img = fruitData.img;
        if (img) {
            const w = img.naturalWidth * scale;
            const h = img.naturalHeight * scale;
            ctx.drawImage(img, -w / 2, -h / 2, w, h); 
        }
        ctx.restore();
    }
}

export function removeMiniBoard(id: string) {
    if (miniBoards[id]) {
        miniBoardsContainer.removeChild(miniBoards[id]);
        delete miniBoards[id];
    }
}