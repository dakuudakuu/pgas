import Level from "./level.js";
import level1Data from "./level1Data.js";

export default class Game {
    constructor(ctx, input) {
        this.ctx = ctx;
        this.input = input;
        this.currentLevel = null;
        this.lastTime = 0;
    }

    start() {
        this.loadLevel(level1Data);
        requestAnimationFrame(this.loop.bind(this));
    }

    loadLevel(data) {
        this.currentLevel = new Level(this.ctx, this.input, data);
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();
        this.input.flush();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        this.currentLevel?.update(dt);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.currentLevel?.draw();
    }
}