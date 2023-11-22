import { Application, Sprite, Texture } from "pixi.js";
import { gHeight } from "./constants";


export const runDropLine = (app: Application, canvas: HTMLCanvasElement) => { 
    const dropLine = Sprite.from(Texture.WHITE);
    dropLine.width = 3;
    dropLine.height = gHeight;
    app.stage.addChild(dropLine);

    onmousemove = (e) => {
        dropLine.x = e.clientX - canvas.offsetLeft
        console.log(dropLine.x)
    }
}