import { Bodies, Composite, Engine } from "matter-js";
import { Application, Assets, Sprite } from "pixi.js";

export let currentFruitsOnScreen = []

export const fruits = [
  {
    name: "cherry",
    texture: "./cherry.png",
    pivot: [23, 41],
  },
  {
    name: "strawberry",
    texture: "./strawberry.png",
    pivot: [30, 36],
  },
  {
    name: "grape",
    texture: "./grape.png",
    pivot: [42, 42],
  },
  {
    name: "persimmon",
    texture: "./persimmon.png",
    pivot: [48, 56],
  },
  {
    name: "orange",
    texture: "./orange.png",
    pivot: [61, 70],
  },
  {
    name: "apple",
    texture: "./apple.png",
    pivot: [80, 84],
  },
  {
    name: "melon",
    texture: "./melon.png",
    pivot: [90, 101],
  },
  {
    name: "peach",
    texture: "./peach.png",
    pivot: [112, 108],
  },
  {
    name: "pineapple",
    texture: "./pineapple.png",
    pivot: [124, 160],
  },
  {
    name: "muskmelon",
    texture: "./muskmelon.png",
    pivot: [153, 153],
  },
  {
    name: "watermelon",
    texture: './watermelon.png',
    pivot: [180, 180],
  }
];

export const createFruit = async (
  app: Application,
  engine: Engine,
  fruit: { name: string, texture: string, pivot: number[] },
  x: number,
  y: number
) => {
  const texture = await Assets.load(fruit.texture);
  let newFruit = Sprite.from(texture);
  let scale = newFruit.scale.set(0.5)
  console.log(scale)
  newFruit.pivot.set(fruit.pivot[0], fruit.pivot[1])
  app.stage.addChild(newFruit)

  let rigidbody = Bodies.circle(x, y, newFruit.width/2, {label: fruit.name,})
  Composite.add(engine.world, rigidbody)
  currentFruitsOnScreen.push({id: rigidbody.id,name: fruit.name , sprite: newFruit,rb: rigidbody})
};
