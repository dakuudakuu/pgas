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

        this.runSound = new Audio("run.mp3");
        this.runSound.loop = true;
        this.wooshSound = new Audio("woosh.mp3");
        this.jumpSound = new Audio("jump.mp3");

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.idle = new Image();
        this.idle.src = "cat_idle.png";
        this.fall = new Image();
        this.fall.src = "cat_fall.png";

        this.run1 = new Image();
        this.run1.src = "cat_run_1.png";
        this.run2 = new Image();
        this.run2.src = "cat_run_2.png";
        this.run3 = new Image();
        this.run3.src = "cat_run_3.png";
        this.run = [this.run1, this.run2, this.run3];

        this.jump1 = new Image();
        this.jump1.src = "cat_jump_1.png";
        this.jump2 = new Image();
        this.jump2.src = "cat_jump_2.png";

        this.currentImage = this.idle;
        this.facingLeft = false;

        this.animationTime = 0;
        this.startTime = 0;
        this.runFPS = 10;
        this.onMovingPlat = false;

        this.hitboxOffsetXRatio = 20 / 85;
        this.hitboxOffsetYRatio = 30 / 85;
        this.hitboxWidthRatio = 55 / 85;
        this.hitboxHeightRatio = 55 / 85;

        this.airJumps = 0;
    }

    handleInput(input) {
        this.isLeft = input.isDown("arrowleft") || input.isDown("a");
        this.isRight = input.isDown("arrowright") || input.isDown("d");
        this.wasUp = input.wasPressed("arrowup") || input.wasPressed(" ") || input.wasPressed("w");
        this.wasLeft = input.wasPressed("arrowleft") || input.wasPressed("a");
        this.wasRight = input.wasPressed("arrowright") || input.wasPressed("d");
    }

    draw(ctx) {
        ctx.save();
        if(this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.currentImage, -this.x - this.width, this.y, this.width, this.width);
        } else {
            ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.width);
        }
        ctx.restore();
    }

    update(dt, elapsedTime) {
        this.move();
        if(this.grounded) {
            this.airJumps = 0;
        }
        this.vy += this.gravity * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if(this.wasLeft || this.wasRight || this.wasUp) {
            this.startTime = elapsedTime;
        }
        this.animationTime = (performance.now() / 1000) - this.startTime;

        this.animate();
    }

    animate()  {
        if(this.vy > 25) {
            this.currentImage = this.fall;
        } else if(this.vy < 10 && this.animationTime < 0.1) {
            this.currentImage = this.run1;
        } else if(this.vy < 10 && this.animationTime < 0.2) {
            this.currentImage = this.jump1;
        } else if(this.vy < 10) {
            this.currentImage = this.jump2;
        } else if(this.isLeft || this.isRight) {
            this.currentImage = this.run[Math.floor(this.animationTime * this.runFPS) % 3];
        } else {
            this.currentImage = this.idle;
        }
    }

    move() {
        if(this.isRight) {
            this.vx = this.speed;
            this.facingLeft = false;
        } else if (this.isLeft) {
            this.vx = -this.speed;
            this.facingLeft = true;
        } else {
            this.vx = 0;
        }

        if(this.wasUp && this.grounded) {
            // this.jumpSound.pause();
            // this.jumpSound.currentTime = 0;
            // this.jumpSound.play();
            this.vy = -400;
        } else if(this.wasUp && this.airJumps == 0) {
            // this.wooshSound.pause();
            // this.wooshSound.currentTime = 0;
            // this.wooshSound.play();
            this.airJumps++;
            this.vy = -400;
        }
    }

    get hitbox() {
        const offsetX = this.hitboxOffsetXRatio * this.width;
        const offsetY = this.hitboxOffsetYRatio * this.height;
        const hbWidth = this.hitboxWidthRatio  * this.width;
        const hbHeight = this.hitboxHeightRatio * this.height;

        const resolvedOffsetX = this.facingLeft
            ? this.width - offsetX - hbWidth
            : offsetX;

        return {
            x: this.x + resolvedOffsetX,
            y: this.y + offsetY,
            width:  hbWidth,
            height: hbHeight,
        };
    }

    stopX() {
        this.vx = 0;
    }

    stopY() {
        this.vy = 0;
    }
}