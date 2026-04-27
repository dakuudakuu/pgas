import Game from "./game.js";
import InputHandler from "./inputHandler.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const input = new InputHandler();
const game = new Game(ctx, input);

const dpr = window.devicePixelRatio || 1;
canvas.width = canvas.offsetWidth * dpr;
canvas.height = canvas.offsetHeight * dpr;
ctx.scale(dpr, dpr);

game.start();