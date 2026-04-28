import Game from "./game.js";
import InputHandler from "./inputHandler.js";

//Creates canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Fixes canvas
const dpr = window.devicePixelRatio || 1;
canvas.width = canvas.offsetWidth * dpr;
canvas.height = canvas.offsetHeight * dpr;
ctx.scale(dpr, dpr);
canvas.logicalWidth = canvas.offsetWidth;
canvas.logicalHeight = canvas.offsetHeight;

//Creates game and input objects
const input = new InputHandler();
const game = new Game(ctx, input);

game.start();