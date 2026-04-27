export default class Character {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.vx = 0;
        this.vy = 0;
        this.gravity = 32;

        this.left = false;
        this.right = false;
    }

    handleInput(input) {
        this.left = input.isDown("arrowleft");
        this.right = input.isDown("arrowright");
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
            this.vx = 10;
        } else if (this.left) {
            this.vx = -10;
        } else {
            this.vx = 0;
        }
    }
}