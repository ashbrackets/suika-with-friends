import { Engine, Bodies, Body, Composite } from "matter-js";
import { Application, Sprite, Texture } from "pixi.js";
import { gHeight, gWidth } from "./constants";
import { bounds } from './game'

let borders: Body;
export let borderSize: number
export let borderHeight: number
export let dropPoint: {x: number, y: number} = {x: 0, y: 0}
dropPoint.x = gWidth / 2
dropPoint.y = gHeight - gHeight * 0.9
export let mousePosition: number

export const runGameBorders = (app: Application, engine: Engine) => {
    borderSize = 20;
    borderHeight = gHeight * 80 / 100
    let ground = Bodies.rectangle(
        gWidth / 2,
        gHeight - borderSize / 2,
        gWidth,
        borderSize,
        { isStatic: true, label: "ground" }
    );
    let leftWall = Bodies.rectangle(
        borderSize / 2,
        gHeight - borderHeight / 2,
        borderSize,
        borderHeight,
        { isStatic: true, label: "leftWall" }
    );
    let rightWall = Bodies.rectangle(
        gWidth - borderSize / 2,
        gHeight - borderHeight / 2,
        borderSize,
        borderHeight,
        { isStatic: true, label: "rightWall" }
    );

    borders = Body.create({
        parts: [ground, leftWall, rightWall],
        isStatic: true,
        label: "borders",
    });

    Composite.add(engine.world, borders);

    let leftWallSprite = Sprite.from(Texture.WHITE);
    leftWallSprite.width = leftWall.bounds.max.x - leftWall.bounds.min.x;
    leftWallSprite.height = leftWall.bounds.max.y - leftWall.bounds.min.y;
    leftWallSprite.x = leftWall.bounds.min.x;
    leftWallSprite.y = leftWall.bounds.min.y;
    app.stage.addChild(leftWallSprite);

    let rightWallSprite = Sprite.from(Texture.WHITE);
    rightWallSprite.width = rightWall.bounds.max.x - rightWall.bounds.min.x;
    rightWallSprite.height = rightWall.bounds.max.y - rightWall.bounds.min.y;
    rightWallSprite.x = rightWall.bounds.min.x;
    rightWallSprite.y = rightWall.bounds.min.y;
    app.stage.addChild(rightWallSprite);

    let groundSprite = Sprite.from(Texture.WHITE);
    groundSprite.width = ground.bounds.max.x - ground.bounds.min.x;
    groundSprite.height = ground.bounds.max.y - ground.bounds.min.y;
    groundSprite.x = ground.bounds.min.x;
    groundSprite.y = ground.bounds.min.y;
    app.stage.addChild(groundSprite);
}

export const runDropLine = (app: Application, canvas: HTMLCanvasElement) => {
    const dropLine = Sprite.from(Texture.WHITE);
    dropLine.width = 3;
    dropLine.height = gHeight - dropPoint.y;
    dropLine.position = dropPoint
    app.stage.addChild(dropLine);

    window.addEventListener('pointerdown', (e) =>{
        let mousePosX = e.clientX - canvas.offsetLeft
        if (mousePosX < bounds) dropPoint.x = bounds
        else if (mousePosX > gWidth - bounds) dropPoint.x = gWidth - bounds
        else dropPoint.x = mousePosX
        dropLine.x = dropPoint.x - dropLine.width / 2
    })
    
    window.addEventListener("pointermove", (e) => {
        mousePosition = e.clientX - canvas.offsetLeft
        if (mousePosition > bounds && mousePosition < gWidth - bounds) {
            dropPoint.x = mousePosition
            dropLine.x = dropPoint.x - dropLine.width / 2
        }
    })
    return dropLine
}

export const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}