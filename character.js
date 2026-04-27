export default class Character {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.vx = 0;
        this.vy = 0;
        this.speed = 50;
        this.gravity = 32;

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
    }

    handleInput(input) {
        this.left = input.isDown("arrowleft");
        this.right = input.isDown("arrowright");
        this.up = input.isDown("arrowup");
        this.down = input.isDown("arrowdown");
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(dt) {
        this.move();
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    move() {
        if(this.right) {
            this.vx = this.speed;
        } else if (this.left) {
            this.vx = -this.speed;
        } else {
            this.vx = 0;
        }
        if(this.up) {
            this.vy = -this.speed;
        } else if(this.down) {
            this.vy = this.speed;
        } else {
            this.vy = 0;
        }
    }
}