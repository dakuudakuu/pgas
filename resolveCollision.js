import { rectIntersects } from "./rectIntersects.js";

export function resolveCollision(char, rect) {
    if (!rectIntersects(char, rect)) {
        return;
    } 
    const overlapLeft   = (char.x + char.width)  - rect.x;
    const overlapRight  = (rect.x + rect.width)   - char.x;
    const overlapTop    = (char.y + char.height)  - rect.y;
    const overlapBottom = (rect.y + rect.height)  - char.y;

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapTop && char.vy > 0) {
        char.y = rect.y - char.height;
        char.stopY();
        char.grounded = true;
        char.x += rect.dx;
    } else if (minOverlap === overlapBottom && char.vy < 0) {
        char.y = rect.y + rect.height;
        char.stopY();
    } else if (minOverlap === overlapLeft) {
        char.x = rect.x - char.width;
        char.stopX();
    } else if (minOverlap === overlapRight) {
        char.x = rect.x + rect.width;
        char.stopX();
    }
}