function createRng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
        const hi = Math.floor(s / 44488);
        const lo = s % 44488;
        s = 48271 * lo - 3399 * hi;
        if (s <= 0) s += 2147483647;
        return (s - 1) / 2147483646;
    };
}

function randomBetween(rng, min, max) {
    return rng() * (max - min) + min;
}
 
function randomColor(rng) {
    const r = Math.floor(rng() * 256);
    const g = Math.floor(rng() * 256);
    const b = Math.floor(rng() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

export class WorldGen {
    /**
     * @param {number} seed         
     * @param {number} maxFromBottom   
     * @param {number} floorY         
     * @param {number} [chunkSize=6000]- 
     */
    constructor(seed, maxFromBottom, floorY, chunkSize = 6000) {
        this._rng            = createRng(seed);
        this._maxFromBottom  = maxFromBottom;
        this._floorY         = floorY;
        this._chunkSize      = chunkSize;
        this._platformHeight = 50;
 
        this._curX          = 0;
        this._curFromBottom = 150;
        this._done          = false;

        this.platforms = [
             {
                x: -5000,
                y: this._floorY,      
                fromBottom: -200,
                width: 100000,
                height: 200,
                color: "darkslategrey",
                moving: false,
                id: "basePlatform",
                prevX: -5000,          
                dx: 0,
                hasMouse: false                
            }
        ];
    }
 
    ensureGenerated(currentFromBottom) {
        if (this._done) return;
        const target = Math.min(currentFromBottom + this._chunkSize, this._maxFromBottom);
        while (this._curFromBottom < target) {
            this._generateNext();
        }
        if (this._curFromBottom >= this._maxFromBottom) {
            this._done = true;
        }
    }
 
    _generateNext() {
        const rng    = this._rng;
        const h      = this._platformHeight;
        const floor  = this._floorY;
        const fb     = Math.floor(this._curFromBottom);
        const y      = floor - fb - h;
        const width  = Math.floor(randomBetween(rng, 80, 400));
        const moving = Math.round(randomBetween(rng, 0, 4)) === 1;
        const amp    = randomBetween(rng, 80, 120);
        const speed  = moving ? randomBetween(rng, 0.4, 5) : 0;
        const cx = Math.floor(this._curX);
 
        this.platforms.push({
            id: "normalPlatform",
            baseX: cx, x: cx, prevX: cx,
            fromBottom: fb, y,
            width, height: h,
            color: randomColor(rng),
            moving, amplitude: amp, speed,
            dx: 0,
            hasMouse: false
        });
 
        if (!moving && rng() < 0.05) {
            const trapWidth = Math.floor(randomBetween(rng, 80, 150));
            const trapAmp   = Math.floor(randomBetween(rng, 275, 350));
            const speed = randomBetween(rng, 2.5, 3);
            const minGap    = 500 + trapAmp;
            const trapBaseX = rng() > 0.5 ? cx + width + minGap : cx - minGap - trapWidth;
 
            if (trapBaseX !== null) {
                this.platforms.push({
                    id: "normalPlatform",
                    baseX: trapBaseX, x: trapBaseX, prevX: trapBaseX,
                    fromBottom: fb, y,
                    width: trapWidth, height: h,
                    color: randomColor(rng),
                    moving: true, amplitude: trapAmp, speed: 2.5,
                    dx: 0,
                    hasMouse: true
                });
            }
        }

        this._curX          += randomBetween(rng, 400, 600) * (rng() > 0.5 ? 1 : -1);
        this._curFromBottom += randomBetween(rng, 150, 200);
    }
}