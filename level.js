import Character from "./character.js";
import { resolveCollision } from "./resolveCollision.js";
import Camera from "./camera.js";

export class Level {
    constructor(ctx, input, data) {
        this.ctx = ctx;
        this.input = input;
        this.data = data;
        this.character = new Character(data.spawnPointX, this.ctx.canvas.logicalHeight - 150, 120, 120, "lime", data.speed, data.gravity);
        this.camera = new Camera(ctx);
        this.elapsedTime = null;
        this.backgroundWidth = 500;
        this.backgroundImage = new Image();
        this.backgroundImage.src = "wood.png";
        this.platformImage = new Image();
        this.platformImage.src = "platform.png";

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
        for(const platform of this.nearbyPlatforms) {
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
        this.drawPlatforms();
        this.character.draw(this.ctx);
        this.camera.end();
        this.drawUI();
    }

    clearCanvas() {
        this.ctx.fillStyle = this.data.backgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.logicalWidth, this.ctx.canvas.logicalHeight);
    }

    drawPlatforms() {
        for(const platform of this.nearbyPlatforms) {
            if(platform.id == "basePlatform") {
                this.ctx.fillStyle = platform.color;
                this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            } else {
                this.ctx.drawImage(this.platformImage, platform.x, platform.y, platform.width, platform.height);
            }
        }
    }

    drawUI() {  
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Altitude: " + this.altitude, 15, 30);
    }

    get nearbyPlatforms() {
        const cullDistance = 2000;
        return this.platforms.filter(p => {
            if (p.id === "basePlatform") return true;
            if (p.moving) {
                // Use sweep range so fast movers aren't culled when swung away
                const sweepLeft  = p.baseX - p.amplitude;
                const sweepRight = p.baseX + p.amplitude + p.width;
                return sweepRight > this.character.x - cullDistance &&
                    sweepLeft  < this.character.x + cullDistance &&
                    Math.abs(p.y - this.character.y) < cullDistance;
            }
            return Math.abs(p.x - this.character.x) < cullDistance &&
                Math.abs(p.y - this.character.y) < cullDistance;
        });
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
        const hb = this.character.hitbox;
        if (hb.y + hb.height > floor && this.character.vy > 0) {
            this.character.grounded = true;
            this.character.stopY();
            const offsetY = hb.y - this.character.y;
            this.character.y = floor - offsetY - hb.height;
            if (this.character.x > 300 || this.character.x < -300) {
                this.character.x = -100;
            }
        }

        for(const platform of this.nearbyPlatforms) {
            let platformHitbox = {
                x: platform.x,
                y: platform.y + 18,
                dx: platform.dx,
                width: platform.width,
                height: platform.height - 15
            }
            resolveCollision(this.character, platformHitbox);
        }
    }
}