import Character from "./character.js";
import { resolveCollision } from "./resolveCollision.js";
import Camera from "./camera.js";

export class Level {
    constructor(ctx, input, data) {
        this.ctx = ctx;
        this.input = input;
        this.data = data;
        this.character = new Character(data.spawnPointX, this.ctx.canvas.logicalHeight - 150, 100, 50, "lime", data.speed, data.gravity);
        this.camera = new Camera(ctx);
        this.elapsedTime = null;
        this.backgroundWidth = 500;
        this.backgroundImage = new Image();
        this.backgroundImage.src = "wood.png";

        const floor = ctx.canvas.logicalHeight;

        this.altitude = Math.ceil((floor - (this.character.y + this.character.height)) / 30);

        this.platforms = data.platforms.map(p => ({
            ...p,
            y: floor - p.fromBottom - p.height,
            prevX: p.x,
            dx: 0
        }));
    }

    update(dt, elapsedTime) {
        this.elapsedTime = elapsedTime;
        this.character.handleInput(this.input);
        this.character.update(dt, elapsedTime);
        this.camera.follow(this.character);
        for(const platform of this.platforms) {
            if(platform.moving) {
                platform.prevX = platform.x;
                platform.x = platform.baseX + (platform.amplitude * Math.sin(platform.speed * this.elapsedTime));
                platform.dx = platform.x - platform.prevX;
            }
        }
        this.collisions();
    }

    draw() {
        this.camera.begin();
        this.clearCanvas();
        this.drawBackground();
        this.character.draw(this.ctx);
        this.drawPlatforms();
        this.camera.end();
        this.drawUI();
    }

    clearCanvas() {
        this.ctx.fillStyle = this.data.backgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.logicalWidth, this.ctx.canvas.logicalHeight);
    }

    drawPlatforms() {
        for(const platform of this.platforms) {
            this.ctx.fillStyle = platform.color;
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    }

    drawUI() {  
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Altitude: " + this.altitude, 15, 30);
    }

    drawBackground() {
        const bw = this.backgroundWidth;
        const startX = Math.floor((this.character.x - 4000) / bw) * bw;
        const startY = Math.floor((this.character.y - 4000) / bw) * bw;
        for(let i = startY; i < this.character.y + 4000; i += this.backgroundWidth) {
            for(let j = startX; j < this.character.x + 4000; j += this.backgroundWidth) {
                this.ctx.drawImage(this.backgroundImage, j, i, this.backgroundWidth, this.backgroundWidth + 1);
            }
        }
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
        this.ctx.fillRect(startX, startY, 8000, 8000);
    }

    collisions() {
        const floor = this.ctx.canvas.logicalHeight;
        this.altitude = Math.ceil((floor - (this.character.y + this.character.height)) / 30);
        this.character.grounded = false;
        if(this.character.y + this.character.height > floor && this.character.vy > 0) {
            this.character.grounded = true;
            this.character.dx = 0;
            this.character.dy = 0;
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
}