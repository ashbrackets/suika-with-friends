import {
  Body,
  Engine,
  Bodies,
  Composite,
  Render,
  Runner,
  Events,
  Vector,
} from "matter-js";
import { Application, Sprite, Texture } from "pixi.js";
import { gWidth, gHeight, borderHeight } from "./constants";
import { createFruit, currentFruitsOnScreen, fruits } from "./fruits";
import { runDropLine } from "./dropline";

const debugCanvas = document.querySelector<HTMLCanvasElement>(".debugCanvas");
const canvas = document.querySelector<HTMLCanvasElement>(".canvas");

let wWidth = window.innerWidth
let wHeight = window.innerHeight

let app: Application;
let render: Render;
let engine: Engine;

app = new Application({
  width: wWidth,
  height: wHeight,
  view: canvas,
  backgroundAlpha: .5,
  resizeTo: window,
  autoDensity: true,
});

engine = Engine.create();
engine.gravity.scale = 0.0005;

render = Render.create({
  canvas: debugCanvas,
  engine: engine,
  options: {
    width: wWidth,
    height: wHeight,
    background: "transparent",
    wireframeBackground: "transparent",
  },
});
Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);

runDropLine(app, canvas);

let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta;
  for (let i = 0; i < currentFruitsOnScreen.length; i++) {
    let fruitSprite = currentFruitsOnScreen[i].sprite;
    let fruitRB = currentFruitsOnScreen[i].rb;

    fruitSprite.x = fruitRB.position.x;
    fruitSprite.y = fruitRB.position.y;
    fruitSprite.rotation = fruitRB.angle;
  }
});

let borderSize = 10;
let ground = Bodies.rectangle(
  gWidth / 2,
  gHeight - borderSize / 2,
  gWidth,
  borderSize,
  { isStatic: true }
);
let leftWall = Bodies.rectangle(
  borderSize / 2,
  gHeight - borderHeight / 2,
  borderSize,
  borderHeight,
  { isStatic: true }
);
let rightWall = Bodies.rectangle(
  gWidth - borderSize / 2,
  gHeight - borderHeight / 2,
  borderSize,
  borderHeight,
  { isStatic: true }
);

let borders = Body.create({
  parts: [ground, leftWall, rightWall],
  isStatic: true,
});

Composite.add(engine.world, borders);

Events.on(engine, "collisionStart", (event) => {
  const pairs = event.pairs;

  pairs.forEach((pair) => {
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;
    let fruitA: { id: number, name: string, sprite: Sprite, rb: Body } | undefined = undefined
    let fruitB: { id: number, name: string, sprite: Sprite, rb: Body } | undefined = undefined

    if (bodyA.label === bodyB.label) {
      for (const fruit of currentFruitsOnScreen) {
        if (bodyA.id === fruit.rb.id) {
          fruitA = fruit
        }
        if (bodyB.id === fruit.rb.id) {
          fruitB = fruit
        }
      }

      const direction = Vector.normalise(Vector.sub(bodyB.position, bodyA.position));
      const collisionPoint = Vector.add(bodyA.position, Vector.mult(direction, bodyA.circleRadius));
      let nextFruitIndex = fruits.findIndex(fruit => fruit.name === fruitA.name) + 1
      if (nextFruitIndex < fruits.length) {
        createFruit(app, engine, fruits[nextFruitIndex], collisionPoint.x, collisionPoint.y)
      }
      removeFruits(fruitA, fruitB)
    }
  });
});

const removeFruits = (fruitA, fruitB) => {
  if (!fruitA || !fruitB) {
    return
  }
  fruitA.sprite.destroy()
  fruitB.sprite.destroy()
  Composite.remove(engine.world, fruitA.rb)
  Composite.remove(engine.world, fruitB.rb)
  currentFruitsOnScreen.splice(currentFruitsOnScreen.indexOf(fruitA), 1)
  currentFruitsOnScreen.splice(currentFruitsOnScreen.indexOf(fruitB), 1)

  console.log(fruitA, fruitB)
  fruitA = undefined
  fruitB = undefined
}

//Handling Input
const rand = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.addEventListener('resize', () => {
  wWidth = window.innerWidth
  wHeight = window.innerHeight

  render.canvas.width = app.view.width
  render.canvas.height = app.view.height
})

onpointerup = (event) => {
  createFruit(app, engine, fruits[rand(0, 4)], event.clientX - canvas.offsetLeft, 50);
};
