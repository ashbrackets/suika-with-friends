import {
  Body,
  Engine,
  Composite,
  Render,
  Runner,
  Events,
  Vector,
} from "matter-js";
import { Application, Sprite } from "pixi.js";
import { createFruit, currentFruitsOnScreen, fruits } from "./fruits";
import { borderSize, dropPoint, mousePosition, rand, runDropLine, runGameBorders, sleep } from "./functions";
import { gWidth, gHeight, dropCooldown } from "./constants";

export let bounds: number = 10

const debugCanvas = document.querySelector<HTMLCanvasElement>(".debugCanvas");
const canvas = document.querySelector<HTMLCanvasElement>(".canvas");
let app: Application;
let render: Render;
let engine: Engine;
let currentFruit: { id: number, name: string, sprite: Sprite, rb: Body }
let dropLine: Sprite
let canDrop = true
let score: number = 0
let colliding = []
let fruitDropIndex = fruits[rand(0,4)]

onload = (e) => {
  app = new Application({
    width: gWidth,
    height: gHeight,
    view: canvas,
    backgroundAlpha: .5,
    autoDensity: true,
  });

  engine = Engine.create();
  engine.gravity.scale = 0.0005;

  // debug renderer
  // render = Render.create({
  //   canvas: debugCanvas,
  //   engine: engine,
  //   options: {
  //     width: gWidth,
  //     height: gHeight,
  //     background: "transparent",
  //     wireframeBackground: "transparent",
  //   },
  // });
  // Render.run(render);
  var runner = Runner.create();
  Runner.run(runner, engine);


  dropLine = runDropLine(app, canvas);
  runGameBorders(app, engine);

  let elapsed = 0.0;
  app.ticker.add(async (delta) => {
    elapsed += delta;

    if (currentFruit) {
      Body.setPosition(currentFruit.rb, dropPoint)
      Body.setSpeed(currentFruit.rb, 0)
      Body.setAngularVelocity(currentFruit.rb, 0)
      Body.setAngle(currentFruit.rb, 0)
    }

    for (let i = 0; i < currentFruitsOnScreen.length; i++) {
      let fruitSprite = currentFruitsOnScreen[i].sprite;
      let fruitRB = currentFruitsOnScreen[i].rb;
      fruitSprite.x = fruitRB.position.x;
      fruitSprite.y = fruitRB.position.y;
      fruitSprite.rotation = fruitRB.angle;
    }
  });

  // Collision Handler
  Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;
    pairs.forEach(async (pair) => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;
      let fruitA: { id: number, name: string, sprite: Sprite, rb: Body } | undefined = undefined
      let fruitB: { id: number, name: string, sprite: Sprite, rb: Body } | undefined = undefined
      let canCollide = true

      if(colliding.includes(bodyA.id) || colliding.includes(bodyB.id)){
        canCollide = false
        colliding.splice(0, colliding.length);
      }

      if (bodyA.label === bodyB.label && canCollide) {
        colliding.push(bodyA.id, bodyB.id)
        console.log(colliding)
        for (const fruit of currentFruitsOnScreen) {
          if (bodyA.id === fruit.rb.id) {
            fruitA = fruit
          }
          if (bodyB.id === fruit.rb.id) {
            fruitB = fruit
          }
        }
        
        removeFruits(fruitA, fruitB)
        const direction = Vector.normalise(Vector.sub(bodyB.position, bodyA.position));
        const collisionPoint = Vector.add(bodyA.position, Vector.mult(direction, bodyA.circleRadius));
        let nextFruitIndex = fruits.findIndex(fruit => fruit.name === fruitA.name) + 1
        if (nextFruitIndex < fruits.length) {
          createFruit(app, engine, fruits[nextFruitIndex], collisionPoint.x, collisionPoint.y)
        }
        score += fruits[nextFruitIndex - 1].points
        document.querySelector('#score').innerHTML = 'Score: ' + score.toString()
      }
    });
  });

  const removeFruits = async (fruitA: any, fruitB: any) => {
    if (!fruitA || !fruitB) {
      return
    }
    fruitA.sprite.destroy()
    fruitB.sprite.destroy()
    Composite.remove(engine.world, fruitA.rb)
    Composite.remove(engine.world, fruitB.rb)
    currentFruitsOnScreen.splice(currentFruitsOnScreen.indexOf(fruitA), 1)
    currentFruitsOnScreen.splice(currentFruitsOnScreen.indexOf(fruitB), 1)
  }

} // end of onload

//Handling Input
window.addEventListener('pointerup', (e) => {
  if (canDrop) {
    getNextFruit()
  }
});

// getting fruits
let nextFruit: { name: string, texture: string, pivot: number[] };

const getNextFruit = async () => {
  dropLine.alpha = 0
  currentFruit = undefined  // basically drops the fruit
  canDrop = false
  setTimeout(async () => {
    //fix this
    if(isDevMode){
      fruitDropIndex = fruits[4]
    }else{
      fruitDropIndex = fruits[rand(0,4)]
    }
    dropLine.alpha = 1
    await createFruit(app, engine, nextFruit, dropPoint.x, dropPoint.y);
    currentFruit = currentFruitsOnScreen[currentFruitsOnScreen.length - 1]
    setBounds(currentFruit)
    nextFruit = fruitDropIndex;
    (document.getElementById('next-fruit-img') as HTMLImageElement).src = nextFruit.texture
    canDrop = true
  }, dropCooldown)
}

const setFruitsOnGameStart = async () => {
  //fix this
  if(isDevMode){
    fruitDropIndex = fruits[4]
  }else{
    fruitDropIndex = fruits[rand(0,4)]
  }
  nextFruit = fruitDropIndex;
  await createFruit(app, engine, nextFruit, dropPoint.x, dropPoint.y);
  currentFruit = currentFruitsOnScreen[currentFruitsOnScreen.length - 1]
  setBounds(currentFruit)
  nextFruit = fruitDropIndex;
  (document.getElementById('next-fruit-img') as HTMLImageElement).src = nextFruit.texture
}

const setBounds = (currentFruit: { id?: number; name?: string; sprite: any; rb?: Body; }) => {
  bounds = currentFruit.sprite.width / 2 + borderSize
  if (mousePosition < bounds) {
    dropPoint.x = bounds
    dropLine.position.x = bounds - dropLine.width / 2
  }
  if (mousePosition > gWidth - bounds) {
    dropPoint.x = gWidth - bounds
    dropLine.position.x = gWidth - bounds - dropLine.width / 2
  }
}

setTimeout(setFruitsOnGameStart, 100)

window.addEventListener('resize', (e) => {
  console.log(window.innerWidth, window.innerHeight)
})


// Dev Mode is terrible pls fix
document.querySelector('#devMode').addEventListener('click', (e) => {
  devMode()
})
let isDevMode = false
const devMode = () =>{
  isDevMode = !isDevMode
}