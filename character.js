export default class Character {
    constructor(x, y, width, height, color, speed, gravity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.vx = 0;
        this.vy = 0;
        this.speed = speed;
        this.gravity = gravity;
        this.grounded = false;

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.airJumps = 0;
    }

    handleInput(input) {
        this.left = input.isDown("arrowleft");
        this.right = input.isDown("arrowright");
        this.up = input.wasPressed("arrowup");
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(dt) {
        this.move();
        if(this.grounded) {
            this.airJumps = 0;
        }
        this.vy += this.gravity * dt;
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

        if(this.up && this.grounded) {
            this.vy = -300;
        } else if(this.up && this.airJumps == 0) {
            this.airJumps++;
            this.vy = -300;
        }
    }

    stopX() {
        this.vx = 0;
    }

    stopY() {
        this.vy = 0;
    }
}