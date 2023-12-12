import { Bodies, Body, Composite, Engine } from "matter-js";
import { Application, Assets, Sprite } from "pixi.js";

export let currentFruitsOnScreen = []

export const fruits = [
  {
    name: "cherry",
    texture: "./cherry.png",
    pivot: [23, 41],
    points: 1,
  },
  {
    name: "strawberry",
    texture: "./strawberry.png",
    pivot: [30, 36],
    points: 3,
  },
  {
    name: "grape",
    texture: "./grape.png",
    pivot: [42, 42],
    points: 6,
  },
  {
    name: "persimmon",
    texture: "./persimmon.png",
    pivot: [48, 56],
    points: 10,
  },
  {
    name: "orange",
    texture: "./orange.png",
    pivot: [61, 70],
    points: 15,
  },
  {
    name: "apple",
    texture: "./apple.png",
    pivot: [80, 84],
    points: 21,
  },
  {
    name: "melon",
    texture: "./melon.png",
    pivot: [90, 101],
    points: 28,
  },
  {
    name: "peach",
    texture: "./peach.png",
    pivot: [112, 108],
    points: 36,
  },
  {
    name: "pineapple",
    texture: "./pineapple.png",
    pivot: [124, 160],
    points: 45,
  },
  {
    name: "muskmelon",
    texture: "./muskmelon.png",
    pivot: [153, 153],
    points: 55,
  },
  {
    name: "watermelon",
    texture: './watermelon.png',
    pivot: [180, 180],
    points: 66,
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
  newFruit.scale.set(.5)
  newFruit.pivot.set(fruit.pivot[0], fruit.pivot[1])
  app.stage.addChild(newFruit)

  let rigidbody = Bodies.circle(x, y, newFruit.width/2, {label: fruit.name})
  Composite.add(engine.world, rigidbody)
  currentFruitsOnScreen.push({id: rigidbody.id,name: fruit.name , sprite: newFruit,rb: rigidbody})
};
