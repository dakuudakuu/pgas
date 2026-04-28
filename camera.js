export default class Camera {
    constructor(ctx, worldWidth, worldHeight) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.width = ctx.canvas.logicalWidth;
        this.height = ctx.canvas.logicalHeight;
    }

    follow(target) {
        this.x = target.x + target.width / 2 - this.width / 2;
        this.y = target.y + target.height / 2 - this.height / 1.5;
    }

    begin() {
        this.ctx.save();
        this.ctx.translate(-this.x, -this.y);
    }

    end() {
        this.ctx.restore();
    }
}