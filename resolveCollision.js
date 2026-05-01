import { rectIntersects } from "./rectIntersects.js";

export function resolveCollision(char, rect, floor) {
    const hb = char.hitbox;
    if (!rectIntersects(hb, rect)) return;

    const offsetX = hb.x - char.x; 
    const offsetY = hb.y - char.y;  

    const overlapLeft   = (hb.x + hb.width)   - rect.x;
    const overlapRight  = (rect.x + rect.width) - hb.x;
    const overlapTop    = (hb.y + hb.height)   - rect.y;
    const overlapBottom = (rect.y + rect.height) - hb.y;

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapTop && char.vy > 0) {
        if(char.vy > 1800) {
            char.grounded = true;
            char.stopY();
            const offsetY = hb.y - char.y;
            char.y = floor - offsetY - hb.height;
            if (char.x > 300 || char.x < -300) {
                char.x = -100;
            }
        } else {
            char.y = rect.y - offsetY - hb.height;
            char.stopY();
            char.grounded = true;
            char.x += rect.dx;
        }
    } else if (minOverlap === overlapBottom && char.vy < 0) {
        char.y = rect.y + rect.height - offsetY;
        char.stopY();
    } else if (minOverlap === overlapLeft) {
        char.x = rect.x - offsetX - hb.width;
        char.stopX();
    } else if (minOverlap === overlapRight) {
        char.x = rect.x + rect.width - offsetX;
        char.stopX();
    }
}