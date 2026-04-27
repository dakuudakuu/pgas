import Character from "./character.js";

export default class Game {
    constructor(ctx, input) {
        this.ctx = ctx;
        this.input = input;
        this.character = new Character(50, 50, 50, 100, "green");
        this.lastTime = 0;
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        this.character.handleInput(this.input);
        this.character.update(dt);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.character.draw(this.ctx);
    }
}