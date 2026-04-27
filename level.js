import Character from "./character.js";
import { rectIntersects } from "./rectIntersects.js";

export default class Level {
    constructor(ctx, input, data) {
        this.ctx = ctx;
        this.input = input;
        this.data = data;
        this.character = new Character(data.spawnPointX, data.spawnPointY, 50, 100, "green", data.speed, data.gravity);
    }

    update(dt) {
        this.character.handleInput(this.input);
        this.character.update(dt);

        const floor = this.ctx.canvas.height;
        this.character.grounded = false;
        if(this.character.y + this.character.height > floor && this.character.vy > 0) {
            this.character.grounded = true;
            this.character.stopY;
            this.character.y = floor - this.character.height;
        }
    }

    draw() {
        this.ctx.fillStyle = this.data.backgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.character.draw(this.ctx);
    }
}