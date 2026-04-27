import Game from "./game.js";
import InputHandler from "./inputHandler.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const input = new InputHandler();
const game = new Game(ctx, input);

game.start();