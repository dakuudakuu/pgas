import Character from "./character.js";
import { resolveCollision } from "./resolveCollision.js";
import Camera from "./camera.js";

export class Level {
    constructor(ctx, input, data) {
        this.ctx = ctx;
        this.input = input;
        this.data = data;
        this.character = new Character(data.spawnPointX, this.ctx.canvas.logicalHeight - 150, 50, 50, "lime", data.speed, data.gravity);
        this.camera = new Camera(ctx);

        const floor = ctx.canvas.logicalHeight;

        this.altitude = floor - (this.character.y + this.character.height);

        this.platforms = data.platforms.map(p => ({
            ...p,
            y: floor - p.fromBottom - p.height
        }));
    }

    update(dt) {
        this.character.handleInput(this.input);
        this.character.update(dt);
        this.camera.follow(this.character);

        const floor = this.ctx.canvas.logicalHeight;
        this.altitude = floor - (this.character.y + this.character.height);
        this.character.grounded = false;
        if(this.character.y + this.character.height > floor && this.character.vy > 0) {
            this.character.grounded = true;
            this.character.stopY();
            this.character.y = floor - this.character.height;
            if(this.character.x > 300 || this.character.x < -300) {
                this.character.x = -100;
            }
        }

        for(const platform of this.platforms) {
            resolveCollision(this.character, platform);
        }
    }

    draw() {
        this.camera.begin();
        this.ctx.fillStyle = this.data.backgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.logicalWidth, this.ctx.canvas.logicalHeight);
        this.character.draw(this.ctx);
        for(const platform of this.platforms) {
            this.ctx.fillStyle = platform.color;
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
        this.camera.end();
        this.drawUI();
    }

    drawUI() {  
        this.ctx.font = "10px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Altitude: " + Math.floor(this.altitude), 10, 10);
    }
}